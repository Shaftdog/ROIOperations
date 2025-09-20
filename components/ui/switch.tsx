import * as React from "react";

import { cn } from "@/lib/utils/cn";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      disabled = false,
      type,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      onCheckedChange?.(!checked);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);

      if (event.defaultPrevented || disabled) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onCheckedChange?.(!checked);
      }
    };

    return (
      <button
        type={type ?? "button"}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-200",
          className
        )}
        disabled={disabled}
        ref={ref}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span
          aria-hidden="true"
          data-state={checked ? "checked" : "unchecked"}
          className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
