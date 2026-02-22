export type ButtonProps = React.ComponentProps<'button'> & {
    isLoading?: boolean;
    loadingText?: string;
    showArrow?: boolean;
    asChild?: boolean;
};

