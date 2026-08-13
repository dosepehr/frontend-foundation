'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useNotification } from '@/hooks/useNotification';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    type NotificationDTO,
    notificationSchema,
} from './schema/notification.schema';

const NotificationPage = () => {
    const { notify } = useNotification();
    const {
        handleSubmit,
        reset,
        register,
        formState: { isSubmitting, errors },
    } = useForm<NotificationDTO>({
        resolver: zodResolver(notificationSchema),
        defaultValues: { message: '' },
    });

    const onSubmit = async ({ message }: NotificationDTO) => {
        const result = await notify(message, { title: 'Frontend Foundation' });
        if (result.ok) reset();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex max-w-md flex-col gap-8 p-6"
        >
            <div className="flex items-start gap-2">
                <div className="flex-1">
                    <Input
                        {...register('message')}
                        placeholder="Type a message…"
                        error={errors?.message?.message}
                    />
                </div>
                <Button type="submit" isLoading={isSubmitting}>
                    Notify
                </Button>
            </div>
            <span className="text-xs text-muted-foreground">
                Sends a system notification with your message and plays a sound.
            </span>
        </form>
    );
};

export default NotificationPage;
