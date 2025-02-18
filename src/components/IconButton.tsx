import { AriaButtonProps } from "@react-types/button";
import { RefObject, useMemo, useRef } from "react";
import { useButton, useFocusRing, useHover } from "react-aria";
import { Link } from "react-router-dom";
import { Icon, IconProps, maybeTooltip, navLink, resolveTooltip } from "src/components";
import { Css, Palette } from "src/Css";
import { BeamButtonProps, BeamFocusableProps } from "src/interfaces";
import { isAbsoluteUrl, noop } from "src/utils";
import { useTestIds } from "src/utils/useTestIds";

export interface IconButtonProps extends BeamButtonProps, BeamFocusableProps {
  /** The icon to use within the button. */
  icon: IconProps["icon"];
  color?: Palette;
  /** The size of the icon, in increments, defaults to 3 which is 24px. */
  inc?: number;
  /** HTML attributes to apply to the button element when it is being used to trigger a menu. */
  menuTriggerProps?: AriaButtonProps;
  buttonRef?: RefObject<HTMLButtonElement>;
  /** Whether to show a 16x16px version of the IconButton */
  compact?: boolean;
  /** Whether to display the contrast variant */
  contrast?: boolean;
}

export function IconButton(props: IconButtonProps) {
  const {
    onClick: onPress,
    disabled,
    color,
    icon,
    autoFocus,
    inc,
    buttonRef,
    tooltip,
    menuTriggerProps,
    openInNew,
    compact = false,
    contrast = false,
  } = props;
  const isDisabled = !!disabled;
  const ariaProps = { onPress, isDisabled, autoFocus, ...menuTriggerProps };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = buttonRef || useRef(null);
  const { buttonProps } = useButton(
    {
      ...ariaProps,
      onPress: typeof onPress === "string" ? noop : onPress,
      elementType: typeof onPress === "string" ? "a" : "button",
    },
    ref,
  );
  const { focusProps, isFocusVisible } = useFocusRing(ariaProps);
  const { hoverProps, isHovered } = useHover(ariaProps);
  const testIds = useTestIds(props, icon);

  const styles = useMemo(
    () => ({
      ...iconButtonStylesReset,
      ...(compact ? iconButtonCompact : iconButtonNormal),
      ...(isHovered && (contrast ? iconButtonContrastStylesHover : iconButtonStylesHover)),
      ...(isFocusVisible && iconButtonStylesFocus),
      ...(isDisabled && iconButtonStylesDisabled),
    }),
    [isHovered, isFocusVisible, isDisabled, compact],
  );
  const iconColor = contrast ? contrastIconColor : defaultIconColor;

  const buttonAttrs = { ...testIds, ...buttonProps, ...focusProps, ...hoverProps, ref: ref as any, css: styles };
  const buttonContent = (
    <Icon icon={icon} color={color || (isDisabled ? Palette.Gray400 : iconColor)} inc={compact ? 2 : inc} />
  );

  const button =
    typeof onPress === "string" ? (
      isAbsoluteUrl(onPress) || openInNew ? (
        <a {...buttonAttrs} href={onPress} className={navLink} target="_blank" rel="noreferrer noopener">
          {buttonContent}
        </a>
      ) : (
        <Link {...buttonAttrs} to={onPress} className={navLink}>
          {buttonContent}
        </Link>
      )
    ) : (
      <button {...buttonAttrs}>{buttonContent}</button>
    );

  // If we're disabled b/c of a non-boolean ReactNode, or the caller specified tooltip text, then show it in a tooltip
  return maybeTooltip({
    title: resolveTooltip(disabled, tooltip),
    placement: "top",
    children: button,
  });
}

const defaultIconColor = Palette.Gray900;
const contrastIconColor = Palette.White;
const iconButtonStylesReset = Css.bTransparent.bsSolid.bgTransparent.cursorPointer.outline0.dif.aic.jcc.transition.$;
const iconButtonNormal = Css.hPx(28).wPx(28).br8.bw2.$;
const iconButtonCompact = Css.hPx(18).wPx(18).br4.bw1.$;
export const iconButtonStylesHover = Css.bgGray200.$;
export const iconButtonContrastStylesHover = Css.bgGray700.$;
const iconButtonStylesFocus = Css.bLightBlue700.$;
const iconButtonStylesDisabled = Css.cursorNotAllowed.$;
