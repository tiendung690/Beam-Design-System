import { render } from "@homebound/rtl-utils";
import { ToggleChipGroup } from "src/inputs/ToggleChipGroup";

describe("ToggleGroupChip", () => {
  it("adds test ids", async () => {
    const options = [
      { label: "Bahamas", value: "m:1" },
      { label: "Southern California", value: "m:2" },
      { label: "Northern California", value: "m:3" },
    ];
    const r = await render(
      <ToggleChipGroup label="Market" options={options} values={["m:2"]} onChange={() => {}} data-testid="market" />,
    );
    expect(r.market_m1()).toHaveAttribute("data-selected", "false");
    expect(r.market_m2()).toHaveAttribute("data-selected", "true");
  });
});
