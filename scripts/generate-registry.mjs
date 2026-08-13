#!/usr/bin/env node
// Generates registry.json from src/components/{ui,controlled,Providers},
// src/utils/{hooks,funcs,api,store}, and src/app/globals.css, so this script
// can publish a self-hosted component registry (writes public/r/*.json
// directly - see the note near OUTPUT_DIR for why `shadcn build` isn't used).
// Re-run whenever components/hooks/utils/tokens change - do not hand-edit
// registry.json.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const UI_DIR = path.join(SRC, 'components/ui');
const CONTROLLED_DIR = path.join(SRC, 'components/controlled');
const PROVIDERS_DIR = path.join(SRC, 'components/Providers');
const HOOKS_DIR = path.join(SRC, 'utils/hooks');
const GLOBALS_CSS = path.join(SRC, 'app/globals.css');

const EXTERNAL_SKIP = new Set(['react', 'react-dom']);

// Bare registryDependencies names (e.g. "theme") always resolve against the
// DEFAULT shadcn registry (ui.shadcn.com), never "the registry this item
// came from" - confirmed by tracing the CLI's resolver. So every dependency
// we declare must be a full URL into our own registry to resolve at all,
// regardless of whether a consumer installs via a raw URL or a configured
// `registries` shortcut.
const REGISTRY_BASE_URL = (process.env.REGISTRY_BASE_URL ?? 'https://frontend-foundation.example.com/r').replace(
    /\/$/,
    '',
);
const depUrl = (name) => `${REGISTRY_BASE_URL}/${name}.json`;

function kebabCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

function isSourceFile(filename) {
    return /\.(ts|tsx)$/.test(filename) && !/\.(test|stories)\./.test(filename);
}

function listDirs(dir) {
    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
}

function listSourceFiles(dir) {
    return fs.readdirSync(dir).filter(isSourceFile).map((f) => path.join(dir, f));
}

// Maps a path relative to SRC (no extension, e.g. "utils/api/client/httpService")
// to its canonical `@/...` alias form. Everything under src/utils/* (hooks
// included) mirrors its on-disk structure under the consumer's `lib` alias
// root (so utils/api/client/httpService -> @/lib/api/client/httpService,
// utils/hooks/useIsMobile -> @/lib/hooks/useIsMobile), matching how
// src/components/* mirrors 1:1 under `@/components/*` already.
function canonicalFromRel(rel) {
    if (rel.startsWith('components/')) return '@/' + rel;
    if (rel.startsWith('utils/')) return '@/lib/' + rel.slice('utils/'.length);
    throw new Error(`No canonical alias mapping for "${rel}"`);
}

// Resolves a relative import specifier to its canonical `@/...` alias form.
function toCanonical(fromFile, spec) {
    const resolved = path.resolve(path.dirname(fromFile), spec);
    const rel = path.relative(SRC, resolved).split(path.sep).join('/');
    return canonicalFromRel(rel);
}

// Canonicalizes deep relative imports (../x) and rewrites the two aliases we
// deliberately keep non-canonical in our own source: everything under
// src/utils/* stays where it is locally, but publishes as if it lived under
// `lib/` (including hooks, which our own tsconfig separately aliases to
// `@/hooks/*` - that alias gets folded into `lib/hooks/` on publish too).
function processContent(fromFile, raw) {
    let content = raw.replace(/from(\s+)(['"])(\.\.[^'"]*)\2/g, (_m, ws, q, spec) => {
        return `from${ws}${q}${toCanonical(fromFile, spec)}${q}`;
    });
    content = content.replace(/@\/utils\//g, '@/lib/');
    content = content.replace(/@\/hooks\//g, '@/lib/hooks/');
    return content;
}

// Extracts every import/export specifier (`from '...'`) in a file, resolving
// relative specifiers to their canonical `@/...` form.
function scanSpecifiers(fromFile, raw) {
    const specifiers = [];
    const re = /(?:^|\n)\s*(?:import|export)[^;]*?from\s+(['"])([^'"]+)\1/g;
    let m;
    while ((m = re.exec(raw))) specifiers.push(m[2]);
    return specifiers
        .map((spec) => (spec.startsWith('.') ? toCanonical(fromFile, spec) : spec))
        .map((spec) => spec.replace(/^@\/utils\//, '@/lib/'))
        .map((spec) => spec.replace(/^@\/hooks\//, '@/lib/hooks/'));
}

function externalPackageName(spec) {
    if (spec.startsWith('@')) return spec.split('/').slice(0, 2).join('/');
    return spec.split('/')[0];
}

const uiDirNames = listDirs(UI_DIR);
const controlledDirNames = listDirs(CONTROLLED_DIR);
const hookDirNames = listDirs(HOOKS_DIR);

// One hook folder is named "useCustomQuery.ts" (containing useCustomQuery.ts
// inside it) instead of "useCustomQuery" like its siblings - not something
// we rename here, just something the name/target derivation has to tolerate.
function hookDisplayName(dirName) {
    return dirName.replace(/\.ts$/, '');
}

const uiKebab = new Map(uiDirNames.map((d) => [d, kebabCase(d)]));
const hookKebab = new Map(hookDirNames.map((d) => [hookDisplayName(d), kebabCase(hookDisplayName(d))]));

// Every file under src/utils/{funcs,api,store} that gets published, one
// registry:lib item per file, mirroring its on-disk subpath under `lib/` in
// the consumer (see canonicalFromRel above). Add a new file here and both
// its target location and its registryDependencies (auto-detected from its
// own imports) follow automatically.
const LIB_FILES = [
    { name: 'utils', srcRelPath: 'utils/funcs/cn.ts' },
    { name: 'dnd-utils', srcRelPath: 'utils/funcs/dnd.utils.ts' },
    { name: 'http-errors', srcRelPath: 'utils/api/types/DTO/http-errors.interface.ts' },
    { name: 'operation-result', srcRelPath: 'utils/api/types/operation-result.type.ts' },
    { name: 'http-error-strategies', srcRelPath: 'utils/api/client/http-error-strategies.ts' },
    { name: 'map-error-to-toast', srcRelPath: 'utils/api/client/mapErrorToToast.ts' },
    { name: 'global-error-handler', srcRelPath: 'utils/api/client/interceptors/globalErrorHandler.ts' },
    { name: 'refresh-token', srcRelPath: 'utils/api/client/interceptors/refreshToken.ts' },
    { name: 'http-service', srcRelPath: 'utils/api/client/httpService.ts' },
    { name: 'react-query-provider', srcRelPath: 'utils/api/provider/ReactQueryProvider.tsx' },
    { name: 'create-store', srcRelPath: 'utils/store/createStore.ts' },
];
// Hooks are lib items too (see the build loop below) - a flat @/lib/hooks/*
// path per hook, matching how their source imports already read (our own
// tsconfig aliases @/hooks/* to utils/hooks/* as flat names already).
const libPathToName = new Map([
    ...LIB_FILES.map(({ name, srcRelPath }) => [canonicalFromRel(srcRelPath.replace(/\.(ts|tsx)$/, '')), name]),
    ...hookDirNames.map((d) => {
        const displayName = hookDisplayName(d);
        return [`@/lib/hooks/${displayName}`, hookKebab.get(displayName) ?? kebabCase(displayName)];
    }),
]);

// Sorts a canonical `@/...` import into a registryDependency (another item
// in this registry) or, for bare package specifiers, a plain npm dependency.
// Shared across components, controlled components, hooks, and lib files.
function classifySpecifier(spec, { registryDeps, dependencies, self, fromFile }) {
    if (spec.startsWith('@/components/ui/')) {
        const name = spec.slice('@/components/ui/'.length).split('/')[0];
        if (name !== self) registryDeps.add(uiKebab.get(name) ?? kebabCase(name));
    } else if (spec.startsWith('@/components/controlled/')) {
        const name = spec.slice('@/components/controlled/'.length).split('/')[0];
        registryDeps.add(kebabCase(name));
    } else if (spec.startsWith('@/lib/')) {
        const depName = libPathToName.get(spec);
        if (!depName) throw new Error(`Unmapped lib import "${spec}" in ${fromFile}`);
        if (depName !== self) registryDeps.add(depName);
    } else if (spec.startsWith('@/')) {
        throw new Error(`Unmapped internal import "${spec}" in ${fromFile}`);
    } else {
        const pkg = externalPackageName(spec);
        if (!EXTERNAL_SKIP.has(pkg)) dependencies.add(pkg);
    }
}

const items = [];

// ---------------------------------------------------------------------------
// ui/ + controlled/ + Providers/ items
// ---------------------------------------------------------------------------

function buildComponentItem({
    dirName,
    dirPath,
    targetAlias,
    targetPrefix,
    type = 'registry:ui',
    baseline = ['utils', 'theme'],
    docs,
}) {
    const files = listSourceFiles(dirPath);
    const registryDeps = new Set(baseline);
    const dependencies = new Set();

    const fileEntries = files.map((absPath) => {
        const raw = fs.readFileSync(absPath, 'utf8');
        const content = processContent(absPath, raw);
        const specifiers = scanSpecifiers(absPath, raw);

        for (const spec of specifiers) {
            classifySpecifier(spec, { registryDeps, dependencies, self: dirName, fromFile: absPath });
        }

        return {
            path: path.relative(ROOT, absPath).split(path.sep).join('/'),
            type,
            target: `${targetAlias}${targetPrefix}${dirName}/${path.basename(absPath)}`,
            content,
        };
    });

    return {
        name: uiKebab.get(dirName) ?? kebabCase(dirName),
        type,
        title: dirName,
        ...(docs ? { docs } : {}),
        files: fileEntries,
        registryDependencies: [...registryDeps].sort().map(depUrl),
        dependencies: [...dependencies].sort(),
    };
}

for (const dirName of uiDirNames) {
    items.push(
        buildComponentItem({
            dirName,
            dirPath: path.join(UI_DIR, dirName),
            targetAlias: '@ui/',
            targetPrefix: '',
        }),
    );
}

for (const dirName of controlledDirNames) {
    items.push(
        buildComponentItem({
            dirName,
            dirPath: path.join(CONTROLLED_DIR, dirName),
            targetAlias: '@components/',
            targetPrefix: 'controlled/',
        }),
    );
}

// Providers/ items are app infrastructure, not design-system primitives, so
// they get no utils/theme baseline and their own registry:component type.
const PROVIDERS_DOCS = {
    AppleSplashScreens:
        'Requires PNG splash images at public/pwa/splash/splash-{width}x{height}.png for each size listed in this file (see the frontend-foundation repo\'s public/pwa/splash for reference dimensions).',
    ServiceWorkerRegister:
        "Registers a service worker at public/sw.js - this component only registers it, it does not generate one. Only activates when NODE_ENV === 'production'.",
};

for (const dirName of ['AppleSplashScreens', 'ServiceWorkerRegister']) {
    items.push(
        buildComponentItem({
            dirName,
            dirPath: path.join(PROVIDERS_DIR, dirName),
            targetAlias: '@components/',
            targetPrefix: 'Providers/',
            type: 'registry:component',
            baseline: [],
            docs: PROVIDERS_DOCS[dirName],
        }),
    );
}

// ---------------------------------------------------------------------------
// registry:lib items - every file listed in LIB_FILES above, plus every
// hook under src/utils/hooks/* (hooks are lib items too, just published as
// flat files under lib/hooks/ instead of mirroring their own folder-per-hook
// layout, since that layout only exists locally to pair each hook with its
// test file).
// ---------------------------------------------------------------------------

function buildLibItem({ name, absPath, target }) {
    const raw = fs.readFileSync(absPath, 'utf8');
    const content = processContent(absPath, raw);
    const specifiers = scanSpecifiers(absPath, raw);
    const registryDeps = new Set();
    const dependencies = new Set();
    for (const spec of specifiers) {
        classifySpecifier(spec, { registryDeps, dependencies, self: name, fromFile: absPath });
    }
    return {
        name,
        type: 'registry:lib',
        title: name,
        files: [
            {
                path: path.relative(ROOT, absPath).split(path.sep).join('/'),
                type: 'registry:lib',
                target,
                content,
            },
        ],
        ...(registryDeps.size ? { registryDependencies: [...registryDeps].sort().map(depUrl) } : {}),
        dependencies: [...dependencies].sort(),
    };
}

for (const { name, srcRelPath } of LIB_FILES) {
    items.push(
        buildLibItem({
            name,
            absPath: path.join(SRC, srcRelPath),
            target: `@lib/${srcRelPath.slice('utils/'.length)}`,
        }),
    );
}

for (const hookDirName of hookDirNames) {
    const displayName = hookDisplayName(hookDirName);
    const dirPath = path.join(HOOKS_DIR, hookDirName);
    const [entryFile] = listSourceFiles(dirPath);
    if (!entryFile) throw new Error(`No source file found for hook ${hookDirName}`);
    items.push(
        buildLibItem({
            name: hookKebab.get(displayName) ?? kebabCase(displayName),
            absPath: entryFile,
            target: `@lib/hooks/${displayName}.ts`,
        }),
    );
}

// ---------------------------------------------------------------------------
// registry:theme item - parsed from globals.css
// ---------------------------------------------------------------------------

function extractBlock(css, selector) {
    const start = css.indexOf(`${selector} {`);
    if (start === -1) throw new Error(`Could not find "${selector} {" block in globals.css`);
    const braceStart = css.indexOf('{', start);
    let depth = 0;
    let i = braceStart;
    for (; i < css.length; i++) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') {
            depth--;
            if (depth === 0) break;
        }
    }
    return { start, end: i + 1, inner: css.slice(braceStart + 1, i) };
}

function parseVars(inner) {
    const vars = {};
    const re = /--([\w-]+):\s*([^;]+);/g;
    let m;
    while ((m = re.exec(inner))) vars[m[1]] = m[2].trim();
    return vars;
}

const globalsCss = fs.readFileSync(GLOBALS_CSS, 'utf8');
const themeBlock = extractBlock(globalsCss, '@theme inline');
const rootBlock = extractBlock(globalsCss, ':root');
const darkBlock = extractBlock(globalsCss, '.dark');

const cssVars = {
    theme: parseVars(themeBlock.inner),
    light: parseVars(rootBlock.inner),
    dark: parseVars(darkBlock.inner),
};

// The rest of globals.css beyond cssVars is mostly either standard shadcn
// Tailwind v4 init boilerplate (already present in any consumer that ran
// `shadcn init`, e.g. the `@apply border-border outline-ring/50` base layer)
// or Next.js-only font wiring (--font-estedad/--font-lato via next/font,
// not portable). What's left and genuinely worth shipping is hand-curated
// here rather than auto-extracted, since @apply can't be losslessly
// converted to the plain-declaration `css` schema shadcn expects.
const css = {
    '@keyframes shimmer': {
        from: { transform: 'translateX(-100%)' },
        to: { transform: 'translateX(100%)' },
    },
    '@utility popover-content-width-full': {
        width: 'var(--radix-popover-trigger-width)',
    },
    svg: {
        'flex-shrink': '0',
    },
    "button:not(:disabled), [role='button']:not(:disabled)": {
        cursor: 'pointer',
    },
    'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
        {
            '-webkit-box-shadow': '0 0 0 1000px var(--card) inset !important',
            'box-shadow': '0 0 0 1000px var(--card) inset !important',
            '-webkit-text-fill-color': 'var(--foreground) !important',
            'caret-color': 'var(--foreground)',
            'clip-path': 'inset(0 round calc(var(--radius) * 0.8))',
            transition: 'background-color 0s 600000s',
        },
};

items.push({
    name: 'theme',
    type: 'registry:theme',
    title: 'Frontend Foundation design tokens',
    cssVars,
    css,
});

// A meta-item with no files of its own, just every other item as a
// registryDependency - installing it pulls in the entire registry through
// the normal dependency resolver, so `npx shadcn add .../index.json` is all
// a consumer needs to get everything in one command.
items.push({
    name: 'index',
    type: 'registry:internal',
    title: 'Everything',
    description: 'Installs every component, hook, and lib item in this registry.',
    registryDependencies: items.map((item) => depUrl(item.name)),
});

// ---------------------------------------------------------------------------

const registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: '@sudo/ui',
    homepage: 'https://frontend-foundation.example.com',
    items,
};

fs.writeFileSync(path.join(ROOT, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');

// Write public/r/*.json ourselves rather than shelling out to `shadcn build`:
// that command re-reads each file straight from disk whenever `path` resolves
// to a real file in this repo, silently discarding the `content` we computed
// above (our import canonicalization and @/lib/* rewrites included).
// Confirmed by inspecting its output - not something a flag controls.
const OUTPUT_DIR = path.join(ROOT, 'public/r');
fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const item of items) {
    const itemJson = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item };
    fs.writeFileSync(path.join(OUTPUT_DIR, `${item.name}.json`), JSON.stringify(itemJson, null, 2) + '\n');
}
fs.writeFileSync(path.join(OUTPUT_DIR, 'registry.json'), JSON.stringify(registry, null, 2) + '\n');

console.log(`Wrote registry.json and public/r/ with ${items.length} items.`);
