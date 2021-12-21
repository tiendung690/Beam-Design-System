import { Selection } from "@react-types/shared";
import { Key, ReactNode, useEffect, useRef, useState } from "react";
import { useButton, useComboBox, useFilter, useOverlayPosition } from "react-aria";
import { Item, useAsyncList, useComboBoxState, useMultipleSelectionState } from "react-stately";
import { resolveTooltip } from "src/components";
import { Popover } from "src/components/internal";
import { PresentationFieldProps } from "src/components/PresentationContext";
import { Css, px } from "src/Css";
import { ListBox } from "src/inputs/internal/ListBox";
import { SelectFieldInput } from "src/inputs/internal/SelectFieldInput";
import { Value, valueToKey } from "src/inputs/Value";
import { BeamFocusableProps } from "src/interfaces";

// export type SelectFieldBaseProps<O, V extends Value> = AsyncSelectFieldProps<O, V> | SyncSelectFieldProps<O, V>;
export interface SelectFieldBaseProps<O, V extends Value> extends BeamSelectFieldBaseProps<O, V> {
  options: O[] | ((search?: string) => Promise<O[]>);
  /** The selected options; it can be `undefined`, even if `O` cannot be. */
  selectedOptions?: O[] | undefined;
  /** The selected values; it can be `undefined`, even if `V` cannot be. */
  values: V[] | undefined;
}

/**
 * Provides a non-native select/dropdown widget.
 *
 * The `O` type is a list of options to show, the `V` is the primitive value of a
 * given `O` (i.e. it's id) that you want to use as the current/selected value.
 *
 * Note that the `V extends Key` constraint come from react-aria,
 * and so we cannot easily change them.
 */
export function SelectFieldBase<O, V extends Value>(props: SelectFieldBaseProps<O, V>): JSX.Element {
  const {
    disabled,
    readOnly,
    onSelect,
    options,
    multiselect = false,
    getOptionLabel,
    getOptionValue,
    getOptionMenuLabel = getOptionLabel,
    nothingSelectedText = "",
    contrast,
    disabledOptions,
    borderless,
    values,
    ...otherProps
  } = props;

  const selectedOptions =
    props.selectedOptions ?? (Array.isArray(options) ? options.filter((o) => values?.includes(getOptionValue(o))) : []);

  const asyncList = useAsyncList<O>({
    load: async () => {
      if (firstRender.current) {
        return { items: selectedOptions };
      }

      // asyncList.remove(...selectedOptions.map((o) => valueToKey(getOptionValue(o))));
      if (Array.isArray(options)) {
        return { items: options };
      }

      if (options) {
        // Here we should do something like:
        // const { items, loadMore } = await options(fieldState.inputValue);
        const items = await options(fieldState.inputValue);
        return { items };
      }

      return { items: selectedOptions };
    },
  });

  const firstOpen = useRef(true);
  async function maybeInitLoad() {
    if (firstOpen.current) {
      // When we do our initial load then we need to remove the initial items we added, as loadMore appends more items.
      // asyncList.remove(...selectedOptions.map((o) => valueToKey(getOptionValue(o))));
      await asyncList.reload();
      firstOpen.current = false;
    }
  }

  const { contains } = useFilter({ sensitivity: "base" });
  const isDisabled = !!disabled;
  const isReadOnly = !!readOnly;

  function onSelectionChange(keys: Selection): void {
    // Close menu upon selection change only for Single selection mode
    if (!multiselect) {
      state.close();
    }
    if (keys === "all") {
      return;
    }

    // `onSelectionChange` may be called even if the selection's didn't change.
    // For example, we trigger this `onBlur` of SelectFieldInput in order to reset the input's value.
    // In those cases, we do not need to again call `onSelect` so let's avoid it if we can.
    const selectionChanged = !(
      keys.size === state.selectionManager.selectedKeys.size &&
      [...keys].every((value) => state.selectionManager.selectedKeys.has(value))
    );

    if (multiselect && keys.size === 0) {
      // "All" happens if we selected everything or nothing.
      setFieldState({
        ...fieldState,
        isOpen: true,
        inputValue: state.isOpen ? "" : nothingSelectedText,
        selectedKeys: [],
        selectedOptions: [],
      });
      selectionChanged && onSelect([], []);
      return;
    }

    const selectedKeys = [...keys.values()];
    const selectedOptions = asyncList.items.filter((o) => selectedKeys.includes(valueToKey(getOptionValue(o))));
    const firstSelectedOption = selectedOptions[0];

    if (multiselect) {
      setFieldState({
        ...fieldState,
        // If menu is open then reset inputValue to "". Otherwise set inputValue depending on number of options selected.
        inputValue: state.isOpen ? "" : firstSelectedOption ? getOptionLabel(firstSelectedOption!) : "",
        selectedKeys,
        selectedOptions,
        filteredOptions: asyncList.items,
      });
    } else {
      setFieldState({
        ...fieldState,
        isOpen: false,
        inputValue: firstSelectedOption ? getOptionLabel(firstSelectedOption) : "",
        selectedKeys,
        selectedOptions,
        filteredOptions: asyncList.items,
      });
    }

    selectionChanged && onSelect(selectedKeys as V[], selectedOptions);
    debugger;
    if (!multiselect) {
      // When a single select menu item changes, then blur the field AFTER `onSelect` has been called
      inputRef.current?.blur();
    }
  }

  function onInputChange(value: string) {
    console.log("onInputChange", value);
    setFieldState((prevState) => ({
      ...prevState,
      isOpen: true,
      inputValue: value,
      filteredOptions: asyncList.items.filter((o) => contains(getOptionLabel(o), value)),
    }));
  }

  function onOpenChange(isOpen: boolean) {
    if (isOpen) {
      maybeInitLoad();
    }
    setFieldState((prevState) => ({
      ...prevState,
      inputValue: multiselect && isOpen ? "" : prevState.inputValue,
      isOpen,
    }));
  }

  function initFieldState(): FieldState<O> {
    return {
      isOpen: false,
      selectedKeys: selectedOptions?.map((o) => valueToKey(getOptionValue(o))) ?? [],
      inputValue:
        selectedOptions.length === 1
          ? getOptionLabel(selectedOptions[0])
          : multiselect && selectedOptions.length === 0
          ? nothingSelectedText
          : "",
      filteredOptions: asyncList.items,
      selectedOptions: selectedOptions,
    };
  }

  useEffect(() => {
    if (!(asyncList.items.length === 0 && fieldState.filteredOptions.length === 0)) {
      setFieldState((prevState) => ({
        ...prevState,
        // Should we filter the options, perhaps that should be done in the asyncList once we move server side filtering.
        filteredOptions: asyncList.items,
      }));
    }
  }, [asyncList.items]);

  const [fieldState, setFieldState] = useState<FieldState<O>>(initFieldState);

  // Ensure we reset if the field's values change and the user is not actively selecting options.
  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current && !state.isOpen) {
      setFieldState(initFieldState);
    }
    firstRender.current = false;
  }, [selectedOptions]);

  // Used to calculate the rendered width of the combo box (input + button)
  const comboBoxRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapRef = useRef<HTMLDivElement | null>(null);
  const listBoxRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  const comboBoxProps = {
    ...otherProps,
    disabledKeys: disabledOptions?.map(valueToKey),
    inputValue: fieldState.inputValue,
    items: fieldState.filteredOptions,
    isDisabled,
    isReadOnly,
    onInputChange,
    onOpenChange,
    menuTrigger: "focus" as const,
    children: (item: any) => (
      <Item key={valueToKey(getOptionValue(item))} textValue={getOptionLabel(item)}>
        {getOptionMenuLabel(item)}
      </Item>
    ),
  };

  const state = useComboBoxState<any>({
    ...comboBoxProps,
    allowsEmptyCollection: true,
    // useComboBoxState.onSelectionChange will be executed if a keyboard interaction (Enter key) is used to select an item
    onSelectionChange: (key) => {
      // ignore undefined/null keys - `null` can happen if input field's value is completely deleted after having a value assigned.
      if (key) {
        const selectedKeys = multipleSelectionState.selectedKeys;
        // Create the `newSelection` Set depending on the value type of SelectField.
        const newSelection: Set<Key> = new Set(!multiselect ? [key] : [...selectedKeys, key]);
        // Use only the `multipleSelectionState` to manage selected keys
        multipleSelectionState.setSelectedKeys(newSelection);
      }
    },
  });

  const multipleSelectionState = useMultipleSelectionState({
    selectionMode: multiselect ? "multiple" : "single",
    // Do not allow an empty selection if single select mode
    disallowEmptySelection: !multiselect,
    selectedKeys: fieldState.selectedKeys,
    onSelectionChange,
  });

  //@ts-ignore - `selectionManager.state` exists, but not according to the types
  state.selectionManager.state = multipleSelectionState;

  // For the most part, the returned props contain `aria-*` and `id` attributes for accessibility purposes.
  const {
    buttonProps: triggerProps,
    inputProps,
    listBoxProps,
    labelProps,
  } = useComboBox(
    {
      ...comboBoxProps,
      inputRef,
      buttonRef: triggerRef,
      listBoxRef,
      popoverRef,
    },
    state,
  );

  const { buttonProps } = useButton({ ...triggerProps, isDisabled: isDisabled || isReadOnly }, triggerRef);

  // useOverlayPosition moves the overlay to the top of the DOM to avoid any z-index issues. Uses the `targetRef` to DOM placement
  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: inputWrapRef,
    overlayRef: popoverRef,
    scrollRef: listBoxRef,
    shouldFlip: true,
    isOpen: state.isOpen,
    onClose: state.close,
    placement: "bottom left",
    offset: borderless ? 8 : 4,
  });

  positionProps.style = {
    ...positionProps.style,
    width: comboBoxRef?.current?.clientWidth,
    // Ensures the menu never gets too small.
    minWidth: 200,
  };

  return (
    <div css={Css.df.fdc.w100.maxw(px(550)).$} ref={comboBoxRef}>
      <SelectFieldInput
        {...otherProps}
        buttonProps={buttonProps}
        buttonRef={triggerRef}
        inputProps={inputProps}
        inputRef={inputRef}
        inputWrapRef={inputWrapRef}
        state={state}
        labelProps={labelProps}
        selectedOptions={fieldState.selectedOptions}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        contrast={contrast}
        nothingSelectedText={nothingSelectedText}
        borderless={borderless}
        tooltip={resolveTooltip(disabled, undefined, readOnly)}
      />
      {state.isOpen && (
        <Popover
          triggerRef={triggerRef}
          popoverRef={popoverRef}
          positionProps={positionProps}
          onClose={() => state.close()}
          isOpen={state.isOpen}
          minWidth={200}
        >
          <ListBox
            {...listBoxProps}
            positionProps={positionProps}
            state={state}
            listBoxRef={listBoxRef}
            selectedOptions={fieldState.selectedOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={(o) => valueToKey(getOptionValue(o))}
            contrast={contrast}
          />
        </Popover>
      )}
    </div>
  );
}

type FieldState<O> = {
  isOpen: boolean;
  selectedKeys: Key[];
  inputValue: string;
  filteredOptions: O[];
  selectedOptions: O[];
};

export interface BeamSelectFieldBaseProps<O, V extends Value> extends BeamFocusableProps, PresentationFieldProps {
  /** Renders `opt` in the dropdown menu, defaults to the `getOptionLabel` prop. */
  getOptionMenuLabel?: (opt: O) => string | ReactNode;
  getOptionValue: (opt: O) => V;
  getOptionLabel: (opt: O) => string;
  onSelect: (values: V[], options: O[]) => void;
  multiselect?: boolean;
  disabledOptions?: V[];
  /** Whether the field is disabled. If a ReactNode, it's treated as a "disabled reason" that's shown in a tooltip.*/
  disabled?: boolean | ReactNode;
  required?: boolean;
  errorMsg?: string;
  helperText?: string | ReactNode;
  /** Allow placing an icon/decoration within the input field. */
  fieldDecoration?: (opt: O) => ReactNode;
  /** Sets the form field label. */
  label: string;
  /** Renders the label inside the input field, i.e. for filters. */
  inlineLabel?: boolean;
  // Whether the field is readOnly. If a ReactNode, it's treated as a "readOnly reason" that's shown in a tooltip.
  readOnly?: boolean | ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
  sizeToContent?: boolean;
  /** The text to show when nothing is selected, i.e. could be "All" for filters. */
  nothingSelectedText?: string;
  /** When set the SelectField is expected to be put on a darker background */
  contrast?: boolean;
  /** Placeholder content */
  placeholder?: string;
}
