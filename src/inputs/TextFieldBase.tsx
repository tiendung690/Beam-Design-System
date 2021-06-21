import { NumberFieldAria } from "@react-aria/numberfield";
import { mergeProps } from "@react-aria/utils";
import React, {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  MutableRefObject,
  TextareaHTMLAttributes,
} from "react";
import { HelperText } from "src/components/HelperText";
import { Label } from "src/components/Label";
import { Css, px, Xss } from "src/Css";
import { ErrorMessage } from "src/inputs/ErrorMessage";
import { BeamTextFieldProps } from "src/interfaces";
import { maybeCall } from "src/utils";
import { defaultTestId } from "src/utils/defaultTestId";
import { useTestIds } from "src/utils/useTestIds";

interface TextFieldBaseProps
  extends Pick<BeamTextFieldProps, "label" | "errorMsg" | "onBlur" | "onFocus" | "helperText">,
    Partial<Pick<BeamTextFieldProps, "onChange">> {
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  inputProps: InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>;
  inputRef?: MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  multiline?: boolean;
  groupProps?: NumberFieldAria["groupProps"];
  /** TextField specific */
  compact?: boolean;
  /** Styles overrides */
  xss?: Xss<"textAlign">;
}

// Used by both TextField and TextArea
export function TextFieldBase(props: TextFieldBaseProps) {
  const {
    label,
    labelProps,
    inputProps,
    inputRef,
    groupProps,
    compact = false,
    errorMsg,
    helperText,
    multiline = false,
    onChange,
    onBlur,
    onFocus,
    xss,
  } = props;
  const errorMessageId = `${inputProps.id}-error`;

  const ElementType: React.ElementType = multiline ? "textarea" : "input";
  const tid = useTestIds(props, defaultTestId(label || "textField"));

  // Watch for each WIP change, convert empty to undefined, and call the user's onChange
  function onDomChange(e: ChangeEvent<HTMLInputElement>) {
    if (onChange) {
      let value: string | undefined = e.target.value;
      if (value === "") {
        value = undefined;
      }
      onChange(value);
    }
  }

  return (
    <div css={Css.df.flexColumn.w100.maxw(px(550)).$} {...groupProps}>
      {label && <Label labelProps={labelProps} label={label} {...tid.label} />}
      <ElementType
        onFocus={(e: FocusEvent<HTMLInputElement> | FocusEvent<HTMLTextAreaElement>) => {
          e.target.select();
          maybeCall(onFocus);
        }}
        {...mergeProps(inputProps, { onBlur, onChange: onDomChange }, { "aria-invalid": Boolean(errorMsg) })}
        {...(errorMsg ? { "aria-errormessage": errorMessageId } : {})}
        ref={inputRef as any}
        rows={multiline ? 1 : undefined}
        css={{
          ...Css.add("resize", "none").bgWhite.sm.px1.hPx(40).gray900.br4.outline0.ba.bGray300.if(compact).hPx(32).$,
          ...xss,
          ...Css.if(multiline).mh(px(96)).py1.px2.$,
          "&:focus": Css.bLightBlue700.$,
          "&:disabled": Css.gray400.bgGray100.cursorNotAllowed.$,
          ...(errorMsg ? Css.bRed600.$ : {}),
        }}
        {...tid}
      />
      {errorMsg && <ErrorMessage id={errorMessageId} errorMsg={errorMsg} {...tid.errorMsg} />}
      {helperText && <HelperText helperText={helperText} {...tid.helperText} />}
    </div>
  );
}
