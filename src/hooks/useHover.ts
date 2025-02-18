import { HTMLAttributes } from "react";
import { useHover as AriaUseHover } from "react-aria";
import { Callback } from "src/types";

interface useHoverProps {
  // Handler that is called when a hover interaction starts
  onHoverStart?: Callback;
  // Handler that is called when a hover interaction ends
  onHoverEnd?: Callback;
  // Handler that is called when hover state changes
  onHoverChange?: (isHovering: boolean) => void;
  // If the hover events should be disabled
  disabled?: boolean;
}

// Handles hover pointer interactions for an element.
export function useHover(props: useHoverProps): { hoverProps: HTMLAttributes<HTMLElement>; isHovered: boolean } {
  const { disabled: isDisabled, ...others } = props;
  return AriaUseHover({ isDisabled, ...others });
}
