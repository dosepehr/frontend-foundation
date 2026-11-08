import z from 'zod';

export const notificationSchema = z.object({
    message: z
        .string()
        .trim()
        .min(1, 'Message is required')
        .max(120, 'Message must be 120 characters or fewer'),
});

export type NotificationDTO = z.infer<typeof notificationSchema>;
