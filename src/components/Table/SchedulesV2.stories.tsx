import { Meta } from "@storybook/react";
import { CollapseToggle, GridStyle, GridTable } from "src/components/Table";
import { Css, Palette } from "src/Css";
import { actionColumn, column, dateColumn } from "./columns";
import { GridDataRow } from "./GridTable";

export default {
  title: "Pages / SchedulesV2",
  parameters: { backgrounds: { default: "white" } },
} as Meta;

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
const rows: GridDataRow<Row>[] = [
  { kind: "header", id: "header" },
  {
    kind: "milestone",
    id: "m1",
    name: "Milestone #1",
    startDate: "May. 1, 2021",
    endDate: "May. 10, 2021",
    duration: 10,
    children: [
      {
        kind: "subgroup",
        id: "s1",
        name: "SubGroup #1",
        startDate: "May. 1, 2021",
        endDate: "May. 10, 2021",
        duration: 10,
        children: [
          {
            kind: "task",
            id: "t1",
            name: "task #1",
            startDate: "May. 1, 2021",
            endDate: "May. 10, 2021",
            duration: 10,
            // TODO: It would be great to access parent data\
            milestone: "Milestone #1",
            subGroup: "SubGroup #1",
            status: "Active",
          },
          {
            kind: "task",
            id: "t1",
            name: "task #2",
            startDate: "May. 1, 2021",
            endDate: "May. 10, 2021",
            duration: 10,
            // TODO: It would be great to access parent data\
            milestone: "Milestone #1",
            subGroup: "SubGroup #1",
            status: "Active",
          },
        ],
      },
      // TODO: Must implement colspan support
      { kind: "add", id: "add 1" },
      { kind: "add", id: "add 2" },
    ],
  },
];

/** Columns */
const arrowColumn = actionColumn<Row>({
  header: (row) => <CollapseToggle row={row} />,
  milestone: (row) => <CollapseToggle row={row} />,
  subgroup: (row) => <CollapseToggle row={row} />,
  task: () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12L4 2.66667L6 2.66667L6 12L4 12Z" fill="#AFAFAF" />
      <path d="M4 10L13.3333 10V12L4 12L4 10Z" fill="#AFAFAF" />
    </svg>
  ),
  add: "",
  w: "70px",
});
// TODO: Skipping selectable row
const idColumn = column<Row>({
  header: "ID",
  milestone: "",
  subgroup: "",
  task: (row) => row.id,
  add: "",
  w: "50px",
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

// TODO: Potentially add 8px spacer between each row
const spacing = { brPx: 8, pxPx: 16, spacerPx: 8 };
const nestedStyle: GridStyle = {
  headerCellCss: Css.bgGray100.xsEm.gray700.p1.df.aic.$,
  firstNonHeaderRowCss: Css.mt1.$,
  cellCss: Css.xs.aic.$,
  nestedCards: {
    topLevelSpacerPx: 8,
    kinds: {
      // TODO: It would be nice if this used CSS Properties so that we can use TRUSS
      milestone: { bgColor: Palette.Gray100, ...spacing },
      subgroup: { bgColor: Palette.White, bColor: Palette.Gray200, ...spacing },
      // TODO: Validate with Dare regarding nested 3rd child.
      task: { bgColor: Palette.White, bColor: Palette.Gray200, ...spacing },
      // Purposefully leave out the `add` kind
    },
  },
};

export function SchedulesV2() {
  return (
    <GridTable<Row>
      rows={rows}
      columns={[arrowColumn, idColumn, nameColumn, startColumn, endColumn]}
      style={nestedStyle}
    />
  );
}

// TODO: Check on how to make draggable rows
