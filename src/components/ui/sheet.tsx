"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"
import { buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

export interface SheetTriggerProps
  extends SheetPrimitive.Trigger.Props,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function SheetTrigger({
  asChild,
  children,
  variant,
  size,
  className,
  ...props
}: SheetTriggerProps) {
  const { ...triggerProps } = props as Record<string, unknown>;
  if ('asChild' in triggerProps) delete triggerProps.asChild;

  let content = children;
  let activeVariant = variant;
  let activeSize = size;
  let mergedClass = className;
  let childOnClick: React.MouseEventHandler<HTMLButtonElement> | undefined;

  // Detect and flatten redundant inner button or Button component to enforce HTML standards
  if (React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const isInnerButton =
      children.type === 'button' ||
      (typeof children.type === 'function' && children.type.name === 'Button') ||
      Boolean(childProps?.['data-slot'] === 'button') ||
      ('variant' in childProps || 'size' in childProps);

    if (isInnerButton) {
      content = childProps.children as React.ReactNode;
      if (!activeVariant && childProps.variant) {
        activeVariant = childProps.variant as VariantProps<typeof buttonVariants>['variant'];
      }
      if (!activeSize && childProps.size) {
        activeSize = childProps.size as VariantProps<typeof buttonVariants>['size'];
      }
      mergedClass = cn(childProps.className as string, mergedClass);
      childOnClick = childProps.onClick as React.MouseEventHandler<HTMLButtonElement>;
    }
  }

  const finalClassName = cn(
    (activeVariant !== undefined || activeSize !== undefined)
      ? buttonVariants({ variant: activeVariant, size: activeSize })
      : undefined,
    mergedClass
  );

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    childOnClick?.(e);
    if (typeof triggerProps.onClick === 'function') {
      (triggerProps.onClick as React.MouseEventHandler<HTMLButtonElement>)(e);
    }
  };

  if (asChild && React.isValidElement(children) && children.type !== 'button') {
    return (
      <SheetPrimitive.Trigger
        data-slot="sheet-trigger"
        render={children}
        nativeButton={false}
        className={finalClassName}
        {...triggerProps}
        onClick={handleClick}
      />
    )
  }

  return (
    <SheetPrimitive.Trigger
      data-slot="sheet-trigger"
      className={finalClassName}
      {...triggerProps}
      onClick={handleClick}
    >
      {content}
    </SheetPrimitive.Trigger>
  )
}

function SheetClose({
  asChild,
  children,
  ...props
}: SheetPrimitive.Close.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    const isChildButton = children.type === 'button';
    return (
      <SheetPrimitive.Close
        data-slot="sheet-close"
        nativeButton={isChildButton}
        render={children}
        {...props}
      />
    )
  }
  return (
    <SheetPrimitive.Close data-slot="sheet-close" {...props}>
      {children}
    </SheetPrimitive.Close>
  )
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 right-3"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        "font-heading text-base font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
