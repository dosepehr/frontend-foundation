import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import {
    HomeIcon,
    SettingsIcon,
    UserIcon,
    BellIcon,
    LogOutIcon,
    ChevronRightIcon,
    FileIcon,
    StarIcon,
    TrashIcon,
    ShieldIcon,
    CreditCardIcon,
    CheckIcon,
    MailIcon,
    LockIcon,
    InboxIcon,
} from 'lucide-react'
import { ItemWrapper } from '.'
import { Badge } from '../Badge'
import Button from '../Button'
import AvatarWrapper from '../Avatar'
import { Switch } from '../Switch'

const meta: Meta<typeof ItemWrapper> = {
    title: 'UI/Item',
    component: ItemWrapper,
    tags: ['autodocs'],
    argTypes: {
        variant: { control: 'radio', options: ['ghost', 'outline', 'filled'] },
        size: { control: 'radio', options: ['xs', 'sm', 'default'] },
        mediaVariant: { control: 'radio', options: ['icon', 'avatar', 'image'] },
        active: { control: 'boolean' },
        disabled: { control: 'boolean' },
        title: { control: 'text' },
        description: { control: 'text' },
    },
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='w-80'>
                <Story />
            </div>
        ),
    ],
}

export default meta
type Story = StoryObj<typeof ItemWrapper>

export const Default: Story = {
    args: {
        title: 'Inbox',
        description: 'View your messages',
        media: <InboxIcon />,
    },
}

export const Outline: Story = {
    args: {
        variant: 'outline',
        title: 'Settings',
        description: 'Manage your preferences',
        media: <SettingsIcon />,
    },
}

export const Filled: Story = {
    args: {
        variant: 'filled',
        title: 'Profile',
        description: 'View and edit your profile',
        media: <UserIcon />,
    },
}

export const Sizes: Story = {
    render: () => (
        <div className='flex flex-col gap-2'>
            <ItemWrapper variant='outline' size='default' title='Default Size' description='The standard size for most use cases.' media={<InboxIcon />} />
            <ItemWrapper variant='outline' size='sm' title='Small Size' description='A compact size for dense layouts.' media={<InboxIcon />} />
            <ItemWrapper variant='outline' size='xs' title='Extra Small Size' description='The most compact size available.' media={<InboxIcon />} />
        </div>
    ),
}

export const Active: Story = {
    args: {
        title: 'Home',
        media: <HomeIcon />,
        active: true,
        onClick: () => {},
    },
}

export const Disabled: Story = {
    args: {
        variant: 'outline',
        title: 'Delete Account',
        description: 'This action is currently unavailable.',
        media: <TrashIcon />,
        disabled: true,
    },
}

export const WithEndSlot: Story = {
    args: {
        variant: 'outline',
        title: 'Notifications',
        media: <BellIcon />,
        end: <Badge>3</Badge>,
        onClick: () => {},
    },
}

export const WithChevron: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5'>
            <ItemWrapper variant='outline' title='Profile' media={<UserIcon />} end={<ChevronRightIcon />} onClick={() => {}} />
            <ItemWrapper variant='outline' title='Security' media={<ShieldIcon />} end={<ChevronRightIcon />} onClick={() => {}} />
            <ItemWrapper variant='outline' title='Billing' media={<CreditCardIcon />} end={<ChevronRightIcon />} onClick={() => {}} />
        </div>
    ),
}

export const NavigationMenu: Story = {
    render: () => (
        <div className='flex flex-col gap-0.5'>
            <ItemWrapper title='Home' media={<HomeIcon />} active onClick={() => {}} />
            <ItemWrapper title='Inbox' media={<MailIcon />} end={<Badge>12</Badge>} onClick={() => {}} />
            <ItemWrapper title='Starred' media={<StarIcon />} onClick={() => {}} />
            <ItemWrapper title='Settings' media={<SettingsIcon />} onClick={() => {}} />
            <ItemWrapper title='Log out' media={<LogOutIcon />} onClick={() => {}} />
        </div>
    ),
}

export const WithAvatar: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5'>
            {[
                { name: 'Alice Johnson', email: 'alice@example.com', fallback: 'AJ' },
                { name: 'Bob Smith', email: 'bob@example.com', fallback: 'BS' },
                { name: 'Carol White', email: 'carol@example.com', fallback: 'CW' },
            ].map((user) => (
                <ItemWrapper
                    key={user.email}
                    variant='outline'
                    mediaVariant='avatar'
                    title={user.name}
                    description={user.email}
                    media={<AvatarWrapper fallback={user.fallback} size='sm' />}
                    end={<ChevronRightIcon />}
                    onClick={() => {}}
                />
            ))}
        </div>
    ),
}

export const WithToggle: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5'>
            <ItemWrapper
                variant='outline'
                title='Push notifications'
                description='Receive alerts on your device'
                media={<BellIcon />}
                end={<Switch defaultChecked />}
            />
            <ItemWrapper
                variant='outline'
                title='Two-factor auth'
                description='Add an extra layer of security'
                media={<LockIcon />}
                end={<Switch />}
            />
        </div>
    ),
}

export const WithAction: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5'>
            {[
                { name: 'profile-photo.png', size: '2.4 MB' },
                { name: 'resume-2024.pdf', size: '1.1 MB' },
            ].map((file) => (
                <ItemWrapper
                    key={file.name}
                    variant='outline'
                    title={file.name}
                    description={file.size}
                    media={<FileIcon />}
                    end={<Button variant='ghost' size='icon-sm'><TrashIcon /></Button>}
                />
            ))}
        </div>
    ),
}

export const SelectableList: Story = {
    render: () => (
        <div className='flex flex-col gap-1.5'>
            {[
                { plan: 'Free', price: '$0/mo', selected: false },
                { plan: 'Pro', price: '$12/mo', selected: true },
                { plan: 'Enterprise', price: 'Custom', selected: false },
            ].map(({ plan, price, selected }) => (
                <ItemWrapper
                    key={plan}
                    variant='outline'
                    title={plan}
                    description={price}
                    media={<CreditCardIcon />}
                    end={selected ? <CheckIcon className='text-primary size-4' /> : undefined}
                    active={selected}
                    onClick={() => {}}
                />
            ))}
        </div>
    ),
}
