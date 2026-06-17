import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import * as React from 'react'
import { SheetWrapper } from './sheet-wrapper'
import Button from '../Button'
import { Input } from '../Input'
import { Label } from '../Label'

const meta = {
    title: 'UI/Sheet',
    tags: ['autodocs'],
    parameters: { layout: 'centered' },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => (
        <SheetWrapper
            trigger={<Button variant='outline'>Open</Button>}
            title='Are you absolutely sure?'
            description='This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
        />
    ),
}

export const EditProfile: Story = {
    render: () => (
        <SheetWrapper
            trigger={<Button variant='outline'>Edit Profile</Button>}
            title='Edit profile'
            description="Make changes to your profile here. Click save when you're done."
            footer={<Button type='submit'>Save changes</Button>}
        >
            <div className='grid gap-6 py-2'>
                <div className='grid gap-3'>
                    <Label htmlFor='sheet-name'>Name</Label>
                    <Input id='sheet-name' defaultValue='Pedro Duarte' />
                </div>
                <div className='grid gap-3'>
                    <Label htmlFor='sheet-username'>Username</Label>
                    <Input id='sheet-username' defaultValue='@peduarte' />
                </div>
            </div>
        </SheetWrapper>
    ),
}

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

export const Sides: Story = {
    render: () => (
        <div className='flex flex-wrap gap-2'>
            {SHEET_SIDES.map((side) => (
                <SheetWrapper
                    key={side}
                    side={side}
                    trigger={
                        <Button variant='outline' className='capitalize'>
                            {side}
                        </Button>
                    }
                    title='Edit profile'
                    description="Make changes to your profile here. Click save when you're done."
                    footer={<Button type='submit'>Save changes</Button>}
                    contentClassName='data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]'
                >
                    <div className='no-scrollbar overflow-y-auto py-2'>
                        {Array.from({ length: 10 }).map((_, index) => (
                            <p
                                key={index}
                                className='mb-2 leading-relaxed text-sm text-muted-foreground'
                            >
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor incididunt
                                ut labore et dolore magna aliqua. Ut enim ad
                                minim veniam, quis nostrud exercitation ullamco
                                laboris.
                            </p>
                        ))}
                    </div>
                </SheetWrapper>
            ))}
        </div>
    ),
}
