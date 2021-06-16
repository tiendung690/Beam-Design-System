import { FieldState } from "@homebound/form-state/dist/formState";
import { Observer } from "mobx-react";
import { Key } from "react";
import { SelectField, SelectFieldProps } from "src/inputs";
import { HasIdAndName, Optional } from "src/types";
import { defaultLabel } from "src/utils/defaultLabel";
import { useTestIds } from "src/utils/useTestIds";

export type BoundSelectFieldProps<T extends object, V extends Key> = Omit<
  SelectFieldProps<T, V>,
  "value" | "onSelect" | "onBlur" | "onFocus"
> & {
  // Allow `onSelect` to be overridden to do more than just `field.set`.
  onSelect?: (option: V | undefined) => void;
  field: FieldState<any, V | null | undefined>;
};

/**
 * Wraps `SelectField` and binds it to a form field.
 *
 * To ease integration with "select this fooId" inputs, we can take a list
 * of objects, `T` (i.e. `TradePartner[]`), but accept a field of type `V`
 * (i.e. `string`).
 *
 * The caller has to tell us how to turn `T` into `V`, which is usually a
 * lambda like `t => t.id`.
 */
export function BoundSelectField<T extends object, V extends Key>(props: BoundSelectFieldProps<T, V>): JSX.Element;
export function BoundSelectField<T extends HasIdAndName<V>, V extends Key>(
  props: Optional<BoundSelectFieldProps<T, V>, "getOptionLabel" | "getOptionValue">,
): JSX.Element;
export function BoundSelectField<T extends object, V extends Key>(
  props: Optional<BoundSelectFieldProps<T, V>, "getOptionValue" | "getOptionLabel">,
): JSX.Element {
  const {
    field,
    options,
    readOnly,
    getOptionValue = (opt: T) => (opt as any).id, // if unset, assume O implements HasId
    getOptionLabel = (opt: T) => (opt as any).name, // if unset, assume O implements HasName
    onSelect = (value) => field.set(value),
    label = defaultLabel(field.key),
    ...others
  } = props;
  const testId = useTestIds(props, field.key);
  return (
    <Observer>
      {() => (
        <SelectField<T, V>
          label={label}
          value={field.value ?? undefined}
          onSelect={onSelect}
          options={options}
          readOnly={readOnly ?? field.readOnly}
          errorMsg={field.touched ? field.errors.join(" ") : undefined}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          onBlur={() => field.blur()}
          onFocus={() => field.focus()}
          {...others}
          {...testId}
        />
      )}
    </Observer>
  );
}
