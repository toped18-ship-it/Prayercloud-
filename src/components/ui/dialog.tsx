import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

export interface DialogTriggerProps
  extends DialogPrimitive.Trigger.Props,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function DialogTrigger({
  asChild,
  children,
  variant,
  size,
  className,
  ...props
}: DialogTriggerProps) {
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
      <DialogPrimitive.Trigger
        data-slot="dialog-trigger"
        render={children}
        nativeButton={false}
        className={finalClassName}
        {...triggerProps}
        onClick={handleClick}
      />
    )
  }

  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      className={finalClassName}
      {...triggerProps}
      onClick={handleClick}
    >
      {content}
    </DialogPrimitive.Trigger>
  )
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  asChild,
  children,
  ...props
}: DialogPrimitive.Close.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    const isChildButton = children.type === 'button';
    return (
      <DialogPrimitive.Close
        data-slot="dialog-close"
        nativeButton={isChildButton}
        render={children}
        {...props}
      />
    )
  }
  return (
    <DialogPrimitive.Close data-slot="dialog-close" {...props}>
      {children}
    </DialogPrimitive.Close>
  )
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base leading-none font-medium",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
