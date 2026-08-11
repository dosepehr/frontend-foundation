/**
 * Component scaffolding.
 *
 *   npm run gen:component <Name>
 *
 * Generates src/components/ui/<Name>/ following the project's conventions:
 *
 *   - Single component (default): the whole component lives in index.tsx.
 *     Files: index.tsx, <name>.types.ts, <name>.stories.tsx, <name>.test.tsx.
 *
 *   - Multi-part component ("has sub-components?" → yes): the sub-parts live in
 *     components.tsx and the main component lives in index.tsx.
 *     Files: index.tsx, components.tsx, <name>.types.ts, <name>.stories.tsx,
 *     <name>.test.tsx.
 *
 * index.tsx always holds real component code — never a bare re-export.
 */
export default function (plop) {
    const dir = 'src/components/ui/{{pascalCase name}}';
    const tpl = (file) => `plop-templates/component/${file}`;

    plop.setGenerator('component', {
        description:
            'Scaffold a UI component (index + types + stories + test, plus components.tsx for multi-part)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name (PascalCase, e.g. DataCard):',
                validate: (value) =>
                    /^[A-Za-z][A-Za-z0-9]*$/.test(String(value).trim()) ||
                    'Use a single alphanumeric name, e.g. DataCard',
            },
            {
                type: 'confirm',
                name: 'parts',
                message:
                    'Does it have sub-components (a components.tsx)? Answer no for a single component.',
                default: false,
            },
        ],
        actions: (data) => {
            const suffix = data.parts ? 'multi' : 'single';
            const actions = [
                {
                    type: 'add',
                    path: `${dir}/index.tsx`,
                    templateFile: tpl(`index-${suffix}.tsx.hbs`),
                },
                {
                    type: 'add',
                    path: `${dir}/{{dashCase name}}.types.ts`,
                    templateFile: tpl(`types-${suffix}.ts.hbs`),
                },
                {
                    type: 'add',
                    path: `${dir}/{{dashCase name}}.stories.tsx`,
                    templateFile: tpl(`stories-${suffix}.tsx.hbs`),
                },
                {
                    type: 'add',
                    path: `${dir}/{{dashCase name}}.test.tsx`,
                    templateFile: tpl(`test-${suffix}.tsx.hbs`),
                },
            ];

            if (data.parts) {
                actions.splice(1, 0, {
                    type: 'add',
                    path: `${dir}/components.tsx`,
                    templateFile: tpl('components.tsx.hbs'),
                });
            }

            return actions;
        },
    });
}
