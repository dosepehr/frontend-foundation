'use client';
import ThemeChange from '@/components/common/ThemeChange';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';
const page = () => {
    return (
        <>
            <ThemeChange />

            <div className='flex flex-wrap gap-2'>
                <Button
                    variant='outline'
                    onClick={() => toast('Event has been created')}
                >
                    Default
                </Button>
                <Button
                    variant='outline'
                    onClick={() => toast.success('Event has been created')}
                >
                    Success
                </Button>
                <Button
                    variant='outline'
                    onClick={() =>
                        toast.info(
                            'Be at the area 10 minutes before the event time'
                        )
                    }
                >
                    Info
                </Button>
                <Button
                    variant='outline'
                    onClick={() =>
                        toast.warning(
                            'Event start time cannot be earlier than 8am'
                        )
                    }
                >
                    Warning
                </Button>
                <Button
                    variant='outline'
                    onClick={() => toast.error('Event has not been created')}
                >
                    Error
                </Button>
                <Button
                    variant='outline'
                    onClick={() => {
                        toast.promise<{ name: string }>(
                            () =>
                                new Promise((resolve,reject) =>
                                    setTimeout(
                                        () => reject({ name: 'Event' }),
                                        2000
                                    )
                                ),
                            {
                                loading: 'Loading...',
                                success: (data) =>
                                    `${data.name} has been created`,
                                error: 'Error',
                            }
                        );
                    }}
                >
                    Promise
                </Button>
            </div>
        </>
    );
};

export default page;

