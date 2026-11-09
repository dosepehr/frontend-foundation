// Sample code for the CodeBlock stories and their demos (not published to the registry).

export const installOutput = `$ npm install
added 1 package, and audited 2 packages in 1s
found 0 vulnerabilities`;

export const componentCode = `import { CodeBlock, CodeBlockContent } from '@/components/ui/CodeBlock';

export function Example({ code }: { code: string }) {
    return (
        <CodeBlock>
            <CodeBlockContent lineNumbers>{code}</CodeBlockContent>
        </CodeBlock>
    );
}`;

export const longLine = `Error: ENOENT: no such file or directory, open '/home/user/projects/frontend-foundation/src/components/ui/CodeBlock/does-not-exist.tsx' at Object.openSync (node:fs:573:18)`;

export const configJson = `{
    "name": "frontend-foundation",
    "private": true,
    "scripts": {
        "dev": "next dev",
        "build": "next build"
    }
}`;

export const longFile = Array.from(
    { length: 40 },
    (_, i) => `const value${i + 1} = compute(${i + 1}); // line ${i + 1}`,
).join('\n');

export const ansiOutput = [
    '\u001B[1m\u001B[32m✓\u001B[0m src/components/ui/CodeBlock/CodeBlock.test.tsx (22 tests) 180ms',
    '\u001B[1m\u001B[31m✗\u001B[0m src/utils/funcs/highlighter/highlighter.test.ts \u001B[33m1 failed\u001B[0m',
    '\u001B[2mDuration\u001B[0m  1.42s',
].join('\n');

export const languageSamples: Record<string, string> = {
    tsx: componentCode,
    json: configJson,
    bash: 'npx shadcn@latest add https://dosepehr.github.io/frontend-foundation/r/code-block.json',
    css: ':root {\n    --primary: oklch(0.546 0.245 262.881);\n    --radius: 0.625rem;\n}',
    python: 'def greet(name: str) -> str:\n    return f"Hello, {name}!"',
};
