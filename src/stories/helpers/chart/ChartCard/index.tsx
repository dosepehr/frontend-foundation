import type { ReactNode } from 'react';

type ChartCardProps = {
    title: string;
    description?: string;
    children: ReactNode;
};

// Story frame: charts sit on the card surface their gaps and rings match.
const ChartCard = ({ title, description, children }: ChartCardProps) => (
    <section className="w-[640px] max-w-full rounded-xl border bg-card p-4 text-card-foreground">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description && (
            <p className="mb-4 text-xs text-muted-foreground">{description}</p>
        )}
        {children}
    </section>
);

export default ChartCard;
