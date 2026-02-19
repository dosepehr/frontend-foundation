import { semanticGroups } from '@/utils/tokens/colors';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta: Meta = {
    title: 'tokens/Colors',
    parameters: { layout: 'padded' },
};

export default meta;



function Swatch({
    name,
    bg,
    fg,
    isFg,
}: {
    name: string;
    bg: string;
    fg?: string;
    isFg?: boolean;
}) {
    return (
        <div
            title={`var(${bg})`}
            style={{
                backgroundColor: `var(${bg})`,
                color: `var(${fg ?? '--foreground'})`,
                border: '1px solid color-mix(in oklch, var(--foreground) 20%, transparent)',
                borderRadius: '0.5rem',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                padding: '0 0.5rem',
                textAlign: 'center',
                gap: '2px',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {isFg && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '0.5rem',
                        background: `var(${fg})`,
                        opacity: 0.08,
                        pointerEvents: 'none',
                    }}
                />
            )}
            <span style={{ fontSize: '0.75rem' }}>{name}</span>
            <span
                style={{ opacity: 0.65, fontSize: '0.62rem', fontWeight: 400 }}
            >
                {bg}
            </span>
        </div>
    );
}

export const Colors: StoryObj = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {semanticGroups.map(({ group, pairs }) => (
                <div key={group}>
                    <p
                        style={{
                            marginBottom: '0.5rem',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                        }}
                    >
                        {group}
                    </p>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: '0.5rem',
                        }}
                    >
                        {pairs.map((p) => (
                            <Swatch key={p.name} {...p} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    ),
};

