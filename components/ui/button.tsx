import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border-2 whitespace-nowrap transition-all outline-none select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 font-serif font-bold uppercase tracking-widest",
  {
    variants: {
      variant: {
        default: "bg-terracotta text-sandstone-light border-leather shadow-[0_4px_10px_rgba(92,58,33,0.3)] hover:bg-[#a8532b] hover:shadow-[0_2px_5px_rgba(92,58,33,0.4)]",
        outline:
          "border-leather bg-sandstone text-leather hover:bg-leather hover:text-sandstone-light shadow-[0_4px_10px_rgba(92,58,33,0.15)] hover:shadow-[0_2px_5px_rgba(92,58,33,0.25)]",
        secondary:
          "bg-sandstone-light text-leather border-[#d2b48c] hover:bg-sandstone shadow-sm",
        ghost:
          "hover:bg-sandstone/50 text-leather border-transparent",
        destructive:
          "bg-red-900 text-sandstone-light border-red-950 hover:bg-red-800",
        link: "text-terracotta underline-offset-4 hover:underline border-transparent",
      },
      size: {
        default: "h-10 px-6 py-2 text-sm",
        xs: "h-7 px-3 text-xs",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
