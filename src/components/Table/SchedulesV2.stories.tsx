import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { CollapseToggle, GridStyle, GridTable } from "src/components/Table";
import { Css, Palette } from "src/Css";
import { Checkbox } from "src/inputs";
import { zeroTo } from "src/utils/sb";
import { actionColumn, column, dateColumn } from "./columns";
import { GridDataRow } from "./GridTable";

export default {
  title: "Pages / SchedulesV2",
  parameters: { backgrounds: { default: "white" } },
} as Meta;

// TODO: Is it possible drag above a group and let it go in.
// TODO: Moving milestones and subgroups around too

/** Types */
type HeaderRow = { kind: "header" };
type MilestoneRow = {
  kind: "milestone";
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
};
type SubGroupRow = {
  kind: "subgroup";
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
};
type TaskRow = {
  kind: "task";
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  milestone: string;
  subGroup: string;
  status: string;
};
type AddRow = { kind: "add" };
type Row = HeaderRow | MilestoneRow | SubGroupRow | TaskRow | AddRow;

/** Rows */
const rows: GridDataRow<Row>[] = [{ kind: "header", id: "header" }, ...createMilestones(2, 1, 5)];

/** Columns */
// FIXME: This column is not vertically aligned
const arrowColumn = actionColumn<Row>({
  header: (row) => <CollapseToggle row={row} />,
  milestone: (row) => <CollapseToggle row={row} />,
  subgroup: (row) => <CollapseToggle row={row} />,
  task: "",
  add: "",
  w: "70px",
});
const selectColumn = actionColumn<Row>({
  header: (row) => <Checkbox label="" onChange={action("Select All")} />,
  milestone: "",
  subgroup: "",
  task: (task) => <Checkbox label="" onChange={action(`Select ${task.name}`)} />,
  add: "",
  w: "20px",
});
// TODO: Skipping selectable row
const idColumn = column<Row>({
  header: "",
  milestone: "",
  subgroup: "",
  task: (row) => row.id,
  add: "",
  w: "20px",
  align: "center",
});
const nameColumn = column<Row>({
  header: "Task",
  milestone: (row) => <div css={Css.baseEm.gray900.df.aic.$}>{row.name}</div>,
  subgroup: (row) => <div css={Css.smEm.gray900.df.aic.$}>{row.name}</div>,
  task: (row) => row.name,
  add: "Add",
});
const startColumn = dateColumn<Row>({
  header: "Start",
  milestone: (row) => <div css={Css.smEm.gray900.$}>{row.startDate}</div>,
  subgroup: (row) => <div css={Css.smEm.gray900.$}>{row.startDate}</div>,
  task: (row) => row.startDate,
  add: "",
});
const endColumn = dateColumn<Row>({
  header: "End",
  milestone: (row) => <div css={Css.smEm.gray900.$}>{row.endDate}</div>,
  subgroup: (row) => <div css={Css.smEm.gray900.$}>{row.endDate}</div>,
  task: (row) => row.endDate,
  add: "",
});
const durationColumn = column<Row>({
  header: "Duration",
  milestone: (row) => <div css={Css.smEm.gray900.$}>{row.duration} days</div>,
  subgroup: (row) => <div css={Css.smEm.gray900.$}>{row.duration} days</div>,
  task: (row) => `${row.duration} days`,
  add: "",
});
const milestoneColumn = column<Row>({
  header: "Milestone",
  // TODO: Would be great if we can omit these
  milestone: "",
  subgroup: "",
  task: (row) => row.milestone,
  add: "",
});
const subCategoryColumn = column<Row>({
  header: "SubCategory",
  // TODO: Would be great if we can omit these
  milestone: "",
  subgroup: "",
  task: (row) => row.subGroup,
  add: "",
});
const statusColumn = column<Row>({
  header: "Status",
  milestone: "",
  subgroup: "",
  task: (row) => row.status,
  add: "",
});
const progressColumn = actionColumn<Row>({
  header: "",
  milestone: "",
  subgroup: "",
  task: "",
  add: "",
  w: "150px",
});

// TODO: Potentially add 8px spacer between each row
const spacing = { brPx: 8, pxPx: 16, spacerPx: 8 };
const style: GridStyle = {
  headerCellCss: Css.bgGray100.xsEm.gray700.p1.df.aic.$,
  firstNonHeaderRowCss: Css.mt2.$,
  cellCss: Css.h100.gray700.xs.aic.$,
  nestedCards: {
    topLevelSpacerPx: 8,
    kinds: {
      // TODO: It would be nice if this used CSS Properties so that we can use TRUSS
      milestone: { bgColor: Palette.Gray100, ...spacing },
      subgroup: { bgColor: Palette.White, ...spacing },
      // TODO: Validate with Dare regarding nested 3rd child.
      task: { bgColor: Palette.White, bColor: Palette.Gray200, ...spacing },
      // Purposefully leave out the `add` kind
    },
  },
};

export function SchedulesV2() {
  return (
    <div css={Css.h("100vh").$}>
      <GridTable<Row>
        rows={rows}
        columns={[
          arrowColumn,
          selectColumn,
          idColumn,
          nameColumn,
          startColumn,
          endColumn,
          durationColumn,
          milestoneColumn,
          subCategoryColumn,
          statusColumn,
          progressColumn,
        ]}
        style={style}
        // FIXME: `firstNonHeaderRowCss` does not work when virtual is enabled
        // Possible fix is to use an ref/class/id for this row
        // as="virtual"
        stickyHeader
      />
    </div>
  );
}

// TODO: Check on how to make draggable rows

/**** Utils *****/
function createTasks(howMany: number, subGroup: string, milestone: string, COUNTER: number): TaskRow[] {
  return zeroTo(howMany).map((id) => ({
    kind: "task",
    id: String(COUNTER++),
    name: `Task #${id}`,
    startDate: "May. 1, 2021",
    endDate: "May. 10, 2021",
    duration: 10,
    milestone,
    subGroup,
    status: "Active",
  }));
}

function createSubGroups(howMany: number, howManyTasks: number, milestone: string, COUNTER: number) {
  return zeroTo(howMany).map<SubGroupRow>((id) => {
    const name = `SubGroup #${id}`;

    return {
      kind: "subgroup",
      id: String(COUNTER++),
      name,
      startDate: "May. 1, 2021",
      endDate: "May. 10, 2021",
      duration: 10,
      children: createTasks(howManyTasks, name, milestone, COUNTER),
    } as SubGroupRow;
  });
}

function createMilestones(howMany: number, howManySubGroups: number, howManyTasks: number) {
  let COUNTER = 0;

  return zeroTo(howMany).map<MilestoneRow>((id) => {
    const name = `Milestone #${id}`;
    debugger;
    return {
      kind: "milestone",
      id: String(COUNTER++),
      name,
      startDate: "May 1, 2021",
      endDate: "May 10, 2021",
      duration: 10,
      children: createSubGroups(howManySubGroups, howManyTasks, name, COUNTER),
    } as MilestoneRow;
  });
}
