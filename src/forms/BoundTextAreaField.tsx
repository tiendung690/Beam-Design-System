import { FieldState } from "@homebound/form-state";
import { Observer } from "mobx-react";
import { TextAreaField, TextAreaFieldProps } from "src/inputs";
import { useTestIds } from "src/utils";
import { defaultLabel } from "src/utils/defaultLabel";

export type BoundTextAreaFieldProps = Omit<
  TextAreaFieldProps,
  "value" | "onChange" | "onBlur" | "onFocus" | "label"
> & {
  // Make optional as it'll create a label from the field's key if not present
  label?: string;
  field: FieldState<any, string | null | undefined>;
  // Optional in case the page wants extra behavior
  onChange?: (value: string | undefined) => void;
};

/** Wraps `TextAreaField` and binds it to a form field. */
export function BoundTextAreaField(props: BoundTextAreaFieldProps) {
  const { field, readOnly, onChange = (value) => field.set(value), label = defaultLabel(field.key), ...others } = props;
  const testId = useTestIds(props, field.key);
  return (
    <Observer>
      {() => (
        <TextAreaField
          label={label}
          value={field.value || undefined}
          onChange={onChange}
          readOnly={readOnly ?? field.readOnly}
          errorMsg={field.touched ? field.errors.join(" ") : undefined}
          onBlur={() => field.blur()}
          onFocus={() => field.focus()}
          {...testId}
          {...others}
        />
      )}
    </Observer>
  );
}
