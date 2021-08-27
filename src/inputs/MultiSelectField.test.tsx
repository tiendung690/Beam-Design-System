import { click, render, RenderResult } from "@homebound/rtl-utils";
import { fireEvent } from "@testing-library/react";
import { useState } from "react";
import { MultiSelectField, MultiSelectFieldProps } from "src/inputs";
import { HasIdAndName, Optional } from "src/types";

const options = [
  { id: "1", name: "One" },
  { id: "2", name: "Two" },
  { id: "3", name: "Three" },
];

describe("MultiSelectFieldTest", () => {
  const onSelect = jest.fn();

  it("can set a value", async () => {
    // Given a MultiSelectField with 1 selected value
    const r = await render(<TestMultiSelectField values={["1"] as string[]} options={options} />);
    // That initially has "One" selected
    expect(r.age()).toHaveValue("One");
    // When we select the 3rd option
    selectOption(r, "Three");
    // Then onSelect was called
    expect(onSelect).toHaveBeenCalledWith(["1", "3"]);
  });

  it("has an empty text box not set", async () => {
    // Given a MultiSelectField with no selected values
    const { age } = await render(<TestMultiSelectField values={[]} options={options} />);
    // That initially has "One" selected
    expect(age()).toHaveValue("");
  });

  it("can have custom an empty text", async () => {
    // Given a MultiSelectField with no selected values
    const { age } = await render(<TestMultiSelectField values={[]} options={options} nothingSelectedText="All" />);
    // Then expect the text input value to show the `nothingSelectedText` value
    expect(age()).toHaveValue("All");
  });

  it("only populates input field with selected single option on blur", async () => {
    // Given a MultiSelectField with no selected values
    const r = await render(<TestMultiSelectField values={[]} options={options} nothingSelectedText="All" />);
    // And when we select the first option
    selectOption(r, "One");
    // Then the input field is still empty
    expect(r.age()).toHaveValue("");

    // When blurring the field
    fireEvent.blur(r.age());
    // Calling blur twice - First blur closes menu and retains focus on input. Second blur actually blurs the input.
    fireEvent.blur(r.age());
    // Then the field should populate with the selected option's value.
    expect(r.age()).toHaveValue("One");
  });

  it("resets input value on blur if it does not match the selected option", async () => {
    // Given a MultiSelectField without a selected options
    const r = await render(<TestMultiSelectField values={[]} options={options} />);
    // When changing the inputs value, and not selecting an option
    fireEvent.input(r.age(), "asdf");
    // And `blur`ing the field
    fireEvent.blur(r.age());
    // Then expect the value to be reset to empty
    expect(r.age()).toHaveValue("");

    // Given a selected option
    selectOption(r, "Three");
    // When changing the inputs value to no longer match the selected option
    fireEvent.input(r.age(), "asdf");

    // And `blur`ing the field
    fireEvent.blur(r.age());
    // Calling blur twice - First blur closes menu and retains focus on input. Second blur actually blurs the input.
    fireEvent.blur(r.age());
    // Then expect the value to be reset to the selected option
    expect(r.age()).toHaveValue("Three");

    // When selecting multiple options
    selectOption(r, "Two");
    // Then the input value should be empty
    expect(r.age()).toHaveValue("");
    // When changing the inputs value to no longer be empty, as expected for multiple options
    fireEvent.input(r.age(), "asdf");
    // And `blur`ing the field
    fireEvent.blur(r.age());
    // Then expect the value to be reset to empty
    expect(r.age()).toHaveValue("");
  });

  it("does not populate input field with multiple items selected", async () => {
    // Given a MultiSelectField with no selected values
    const r = await render(<TestMultiSelectField values={[]} options={options} nothingSelectedText="All" />);
    const text = r.getByRole("combobox");

    // When we select two options
    selectOption(r, "One");
    selectOption(r, "Two");

    // And when blurring the field
    fireEvent.blur(text);

    // Then the input field is stay empty
    expect(text).toHaveValue("");
  });

  function TestMultiSelectField(
    props: Optional<
      MultiSelectFieldProps<HasIdAndName<string>, string>,
      "label" | "onSelect" | "getOptionLabel" | "getOptionValue"
    >,
  ): JSX.Element {
    const [selected, setSelected] = useState(props.values);
    return (
      <MultiSelectField
        label="Age"
        getOptionLabel={(o) => o.name}
        getOptionValue={(o) => o.id}
        {...props}
        values={selected}
        onSelect={(values) => {
          onSelect(values);
          setSelected(values);
        }}
        data-testid="age"
      />
    );
  }
});

function selectOption(r: RenderResult, name: string): void {
  const text = r.getByRole("combobox");
  text.focus();
  fireEvent.input(text, { target: { value: "" } });
  click(r.getByRole("option", { name }));
}
