import React, { MutableRefObject } from "react";
import { DismissButton, OverlayContainer, useOverlay } from "react-aria";

interface PopoverProps extends React.PropsWithChildren<any> {
  triggerRef: MutableRefObject<HTMLElement | null>;
  popoverRef: MutableRefObject<HTMLDivElement | null>;
  positionProps: React.HTMLAttributes<Element>;
  onClose: () => void;
  isOpen: boolean;
}

/** Popover is used for generating menus and list-boxes */
export function Popover(props: PopoverProps) {
  const { triggerRef, popoverRef, positionProps, children, onClose, isOpen, ...others } = props;
  const { overlayProps } = useOverlay(
    {
      onClose,
      isOpen,
      isDismissable: true,
      shouldCloseOnInteractOutside: (e) => {
        // By default when passing `isDismissable: true` then Popover will `stopPropagation` of the PointerDown event, which is used nearly everywhere in React-Aria (like for clicking buttons)
        // We do not want that propagation to be stopped, but we still want the overlay to be dismissable.
        // When providing `isDimissable: true`, then you can also provide this callback function, `shouldCloseOnInteractOutside`
        // By returning `false` in this function it will no longer call `stopPropagation`, but it also will not call `onHide` for us, so we need to call `onClose` ourselves.

        // If we clicked the trigger element (or within it), then that will call a `state.toggle` for us.
        // Return early if that happens, otherwise we'd call `onClose`, then the trigger would toggle it back open.
        if (triggerRef.current?.contains(e)) {
          return true;
        }

        onClose();
        return false;
      },
      ...others,
    },
    popoverRef,
  );

  return (
    <OverlayContainer>
      <div {...{ ...overlayProps, ...positionProps }} ref={popoverRef}>
        {children}
        <DismissButton onDismiss={() => onClose()} />
      </div>
    </OverlayContainer>
  );
}
