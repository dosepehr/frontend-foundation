import OfflinePage from '@/features/offline/OfflinePage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Offline',
};

export default function Page() {
    return <OfflinePage />;
}
