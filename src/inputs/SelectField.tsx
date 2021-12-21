import React from "react";
import { Value } from "src/inputs";
import { BeamSelectFieldBaseProps, SelectFieldBase } from "src/inputs/internal/SelectFieldBase";
import { HasIdAndName, Optional } from "src/types";

// export type SelectFieldProps<O, V extends Value> = AsyncSelectFieldProps<O, V> | SyncSelectFieldProps<O, V>;

/**
 * Provides a non-native select/dropdown widget.
 *
 * The `O` type is a list of options to show, the `V` is the primitive value of a
 * given `O` (i.e. it's id) that you want to use as the current/selected value.
 */
export function SelectField<O, V extends Value>(
  props: AsyncSelectFieldProps<O, V> | SyncSelectFieldProps<O, V>,
): JSX.Element;
export function SelectField<O extends HasIdAndName<V>, V extends Value>(props: Opt1<O, V> | Opt2<O, V>): JSX.Element;
export function SelectField<O, V extends Value>(props: Opt1<O, V> | Opt2<O, V>): JSX.Element {
  const {
    getOptionValue = (opt: O) => (opt as any).id, // if unset, assume O implements HasId
    getOptionLabel = (opt: O) => (opt as any).name, // if unset, assume O implements HasName
    options,
    onSelect,
    ...otherProps
  } = props;

  const typeProps = isAsyncProps(props)
    ? {
        selectedOptions: props.selectedOption ? [props.selectedOption] : [],
        // Passing empty values array as it is required in SelectFieldBase, but will immediately use `selectedOptions` if available
        values: [],
      }
    : {
        values: (props as SyncSelectFieldProps<O, V>).value ? [(props as SyncSelectFieldProps<O, V>).value] : [],
      };

  return (
    <SelectFieldBase
      {...otherProps}
      {...typeProps}
      options={options}
      getOptionLabel={getOptionLabel}
      getOptionValue={getOptionValue}
      onSelect={(selectedValues, selectedOptions) => {
        if (selectedOptions.length > 0) {
          onSelect && selectedOptions[0] && onSelect(selectedValues[0], selectedOptions[0]);
        }
      }}
    />
  );
}

interface AsyncSelectFieldProps<O, V extends Value>
  extends Omit<BeamSelectFieldBaseProps<O, V>, "onSelect" | "multiselect"> {
  options: (search?: string) => Promise<O[]>;
  /** The selected options; it can be `undefined`, even if `O` cannot be. */
  selectedOption: O | undefined;
  onSelect: (value: V, opt: O) => void;
}

interface SyncSelectFieldProps<O, V extends Value>
  extends Omit<BeamSelectFieldBaseProps<O, V>, "onSelect" | "multiselect"> {
  options: O[];
  /** The selected values; it can be `undefined`, even if `V` cannot be. */
  value: V | undefined;
  onSelect: (value: V, opt: O) => void;
}

function isAsyncProps<O, V extends Value>(props: Opt1<O, V> | Opt2<O, V>): props is Opt1<O, V> {
  return typeof props === "object" && "options" in props && typeof props.options === "function";
}

type Opt1<O, V extends Value> = Optional<AsyncSelectFieldProps<O, V>, "getOptionLabel" | "getOptionValue">;
type Opt2<O, V extends Value> = Optional<SyncSelectFieldProps<O, V>, "getOptionLabel" | "getOptionValue">;

interface AsyncSelectFieldProps<O, V extends Value> {
  options: O[] | { initial: O[]; load: () => Promise<{ options: O[] }> };
  selectedOption: O | undefined;
}

interface SyncSelectFieldProps<O, V extends Value> {
  options: O[];
  value: V | undefined;
}
