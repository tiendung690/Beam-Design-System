import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { useMemo, useState } from "react";
import { Css, Only } from "src/Css";
import { TextAreaField, TextAreaFieldProps, TextField } from "src/inputs";
import { TextFieldXss } from "src/interfaces";

export default {
  component: TextAreaField,
  title: "Inputs/Text Area",
} as Meta;

export function TextAreaStyles() {
  return (
    <div css={Css.df.fdc.childGap5.$}>
      <div css={Css.df.fdc.childGap2.$}>
        <h1 css={Css.lg.$}>Regular</h1>
        <TestTextArea value="" label="Description" hideLabel />
        <TestTextArea label="Description" value="" />
        <TestTextArea label="Description" value="An example description text." autoFocus />
        <TestTextArea
          label="Description"
          value="This is a description that can no longer be edited."
          disabled="Disabled reason tooltip"
        />
        <TestTextArea
          label="Description"
          value="See helper text."
          helperText="Some really long helper text that we expect to wrap."
        />
        <ValidationTextArea value="Not enough characters" />
        <TextField label="Regular Field For Reference" value="value" onChange={() => {}} />

        <h1 css={Css.lg.$}>Modified for Blueprint To Do Title</h1>
        <TestTextArea label="Title" value="Test title" preventNewLines hideLabel borderless xss={Css.xl2Em.$} />
      </div>
    </div>
  );
}

export function TextAreaReadOnly() {
  return (
    <div css={Css.df.childGap2.$}>
      <div css={Css.df.fdc.childGap3.$}>
        <b>Read Only</b>
        <TestTextArea label="Name" value="first" readOnly={true} />
        <TestTextArea label="Name" value="first - with a tooltip" hideLabel readOnly="Read only with a tooltip" />
        <TestTextArea label="Name" value={("first ".repeat(40) + "last.\n\n").repeat(4)} readOnly={true} />
        <TestTextArea label="Name" value={"this is a sentence\n".repeat(4)} readOnly={true} />
      </div>
      {/*Matching column but w/o readOnly for comparison*/}
      <div css={Css.df.fdc.childGap3.wPx(400).$}>
        <b>Editable</b>
        <TestTextArea label="Name" value="first" />
        <TestTextArea label="Name" value="first" hideLabel />
        <TestTextArea label="Name" value={("first ".repeat(40) + "last.\n\n").repeat(4)} />
        <TestTextArea label="Name" value={"this is a sentence\n".repeat(4)} />
      </div>
    </div>
  );
}

export function SchedulesV2TaskName() {
  return (
    <div css={Css.df.fdc.childGap2.p2.wPx(240).$}>
      <TestTextArea label="Task name" hideLabel value="Task name" preventNewLines borderless />
      <TestTextArea
        label="Task name"
        hideLabel
        value="A task name that will wrap, but we don't support new lines. (And in focus)"
        preventNewLines
        borderless
        autoFocus
      />
    </div>
  );
}

function TestTextArea<X extends Only<TextFieldXss, X>>(props: Omit<TextAreaFieldProps<X>, "onChange">) {
  const { value, ...others } = props;
  const [internalValue, setValue] = useState(value);
  return (
    <TextAreaField
      value={internalValue}
      onChange={(val) => setValue(val)}
      {...others}
      onBlur={action("onBlur")}
      onFocus={action("onFocus")}
    />
  );
}

function ValidationTextArea({ value }: { value: string }) {
  const [internalValue, setValue] = useState<string | undefined>(value);
  const isValid = useMemo(() => internalValue && internalValue.length >= 50, [internalValue]);

  return (
    <TextAreaField
      label="Description"
      value={internalValue}
      onChange={(val) => setValue(val)}
      errorMsg={
        !isValid ? "Please enter at least 50 characters. We should probably provide a character counter." : undefined
      }
      onBlur={action("onBlur")}
      onFocus={action("onFocus")}
    />
  );
}
