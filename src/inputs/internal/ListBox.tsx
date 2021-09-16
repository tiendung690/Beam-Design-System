import React, { Key, MutableRefObject, useEffect, useRef, useState } from "react";
import { DismissButton, useListBox } from "react-aria";
import { SelectState } from "react-stately";
import { Virtuoso } from "react-virtuoso";
import { VirtuosoHandle } from "react-virtuoso/dist/components";
import { Chip } from "src/components/Chip";
import { Option } from "src/components/internal/index";
import { Css } from "src/Css";

interface ListBoxProps<O, V extends Key> {
  compact: boolean;
  listBoxRef: MutableRefObject<HTMLDivElement | null>;
  state: SelectState<O>;
  selectedOptions: O[];
  getOptionLabel: (opt: O) => string;
  getOptionValue: (opt: O) => V;
  contrast?: boolean;
  positionProps: React.HTMLAttributes<Element>;
}

/** A ListBox is an internal component used by SelectField and MultiSelectField to display the list of options */
export function ListBox<O, V extends Key>(props: ListBoxProps<O, V>) {
  const {
    state,
    compact,
    listBoxRef,
    selectedOptions,
    getOptionLabel,
    getOptionValue,
    contrast = false,
    positionProps,
    ...otherProps
  } = props;
  const { listBoxProps } = useListBox({ disallowEmptySelection: true, ...otherProps }, state, listBoxRef);

  const positionMaxHeight = positionProps.style?.maxHeight;
  // The maxListHeight will be based on the value defined by the positionProps returned from `useOverlayPosition` (which will always be a defined as a `number` based on React-Aria's `calculatePosition`).
  // If `maxHeight` is set use that, otherwise use `273` as a default (`42px` is the min-height of each option, so this allows
  // 6.5 options in view at a time (doing `.5` so the user can easily tell if there are more).
  const maxListHeight = positionMaxHeight && typeof positionMaxHeight === "number" ? positionMaxHeight : 273;
  // We define some spacing between the ListBox and the trigger element, and depending on where the list box renders (above or below) we need to adjust the spacing.
  // We can determine if the position was flipped based on what style is defined, `top` (for positioned below the trigger), and `bottom` (for above the trigger).
  // The above assumption regarding `top` and `bottom` is true as long as we use `bottom` as our default `OverlayPosition.placement` (set in SelectFieldBase).
  // The reason the placement may not be on bottom even though we set `bottom` is because also set `shouldFlip: true`
  const isPositionedAbove = !positionProps.style?.top;
  const [listHeight, setListHeight] = useState(maxListHeight);
  const isMultiSelect = state.selectionManager.selectionMode === "multiple";
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const focusedItem = state.collection.getItem(state.selectionManager.focusedKey);

  // Handle scrolling to the item in focus when navigating options via Keyboard
  useEffect(() => {
    if (virtuosoRef.current && focusedItem?.index) {
      virtuosoRef.current.scrollToIndex({ index: focusedItem.index, align: "center" });
    }
  }, [focusedItem]);

  return (
    <div
      css={{
        ...Css.bgWhite.br4.w100.bshBasic.if(contrast).bgGray700.$,
        // Add spacing based on menu's position relative to the trigger element
        ...(isPositionedAbove ? Css.mbPx(4).$ : Css.mtPx(4).$),
        "&:hover": Css.bshHover.$,
      }}
      ref={listBoxRef}
      {...listBoxProps}
    >
      {isMultiSelect && state.selectionManager.selectedKeys.size > 0 && (
        <ul css={Css.listReset.pt2.pl2.pb1.pr1.df.bb.bGray200.add("flexWrap", "wrap").$}>
          {selectedOptions.map((o) => (
            <ListBoxChip
              key={getOptionValue(o)}
              state={state}
              option={o}
              getOptionValue={getOptionValue}
              getOptionLabel={getOptionLabel}
              disabled={state.disabledKeys.has(getOptionValue(o))}
            />
          ))}
        </ul>
      )}
      <ul css={Css.listReset.hPx(Math.min(maxListHeight, listHeight)).$}>
        <Virtuoso
          ref={virtuosoRef}
          totalListHeightChanged={setListHeight}
          totalCount={state.collection.size}
          // We don't really need to set this, but it's handy for tests, which would
          // otherwise render just 1 row. A better way to do this would be to jest.mock
          // out Virtuoso with an impl that just rendered everything, but doing this for now.
          initialItemCount={3}
          itemContent={(idx) => {
            // MapIterator doesn't have at/index lookup so make a copy
            const keys = [...state.collection.getKeys()];
            const item = state.collection.getItem(keys[idx]);
            if (item) {
              return <Option key={item.key} item={item} state={state} contrast={contrast} />;
            }
          }}
        />
      </ul>
      <DismissButton onDismiss={() => state.close()} />
    </div>
  );
}

interface ListBoxChipProps<O, V extends Key> {
  state: SelectState<O>;
  option: O;
  getOptionLabel: (opt: O) => string;
  getOptionValue: (opt: O) => V;
  disabled?: boolean;
}

/** Chip used to display selections within ListBox when using the MultiSelectField */
function ListBoxChip<O, V extends Key>(props: ListBoxChipProps<O, V>) {
  const { state, option, getOptionLabel, getOptionValue, disabled = false } = props;
  return (
    <li css={Css.mr1.mb1.$}>
      <Chip
        text={getOptionLabel(option)}
        onClick={() => {
          state.selectionManager.toggleSelection(String(getOptionValue(option)));
        }}
        disabled={disabled}
      />
    </li>
  );
}
