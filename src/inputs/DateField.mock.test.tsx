import { fireEvent } from "@testing-library/react";
import { noop } from "src/utils";
import { render, type } from "src/utils/rtl";
import { DateField as MockDateField } from "./DateField.mock";

describe("MockDateField", () => {
  it("formats date value when provided", async () => {
    const r = await render(<MockDateField label="Start Date" value={new Date(2020, 0, 1)} onChange={() => {}} />);
    expect(r.date()).toHaveValue("01/01/20");
  });

  it("fires onChange with selected date", async () => {
    const onChange = jest.fn();
    const r = await render(<MockDateField label="Start Date" value={undefined} onChange={onChange} />);
    // When we change the date
    type(r.date, "02/11/20");
    // Then onChange was called with parsed date
    expect(onChange).toHaveBeenCalledWith(new Date(2020, 1, 11));
    expect(r.date()).toHaveValue("02/11/20");
  });

  it("fires onFocus and onBlur", async () => {
    // Given a mock DateField with onBlur and onFocus callbacks
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const r = await render(
      <MockDateField label="Start Date" value={undefined} onChange={noop} onFocus={onFocus} onBlur={onBlur} />,
    );
    // When firing the events
    fireEvent.focus(r.date());
    fireEvent.blur(r.date());
    // Expect the callbacks to be invoked
    expect(onFocus).toBeCalledTimes(1);
    expect(onBlur).toBeCalledTimes(1);
  });
});
