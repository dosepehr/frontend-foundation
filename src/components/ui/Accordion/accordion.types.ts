import type { ComponentProps, ReactNode } from "react"
import type { Accordion as AccordionPrimitive } from "radix-ui"

type AccordionItemProps = ComponentProps<typeof AccordionPrimitive.Item>
type AccordionTriggerProps = ComponentProps<typeof AccordionPrimitive.Trigger>
type AccordionContentProps = ComponentProps<typeof AccordionPrimitive.Content>

export type AccordionWrapperProps = {
  trigger: ReactNode
  children: ReactNode
  itemProps?: Omit<AccordionItemProps, "value"> & { value: string }
  triggerProps?: AccordionTriggerProps
  contentProps?: AccordionContentProps
} & Pick<AccordionItemProps, "value" | "className" | "disabled">
