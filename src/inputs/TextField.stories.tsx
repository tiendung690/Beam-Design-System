import { action } from "@storybook/addon-actions";
import { Meta } from "@storybook/react";
import { useMemo, useState } from "react";
import { Css } from "src/Css";
import { TextField, TextFieldProps } from "src/inputs";

export default {
  component: TextField,
  title: "Inputs/Text Field",
} as Meta;

export function TextFieldStyles() {
  return (
    <div css={Css.df.fdc.childGap5.$}>
      <div css={Css.df.fdc.childGap2.$}>
        <h1 css={Css.lg.$}>Regular</h1>
        <TestTextField value="" label="Name" hideLabel />
        <TestTextField value="Brandon" label="Name" inlineLabel />
        <TestTextField label="Name" value="" />
        <TestTextField label="Name" required value="" />
        <TestTextField label="Name Focused" value="Brandon" autoFocus />
        <TestTextField label="Name Disabled" value="Brandon" disabled />
        <TestTextField
          label="Name Helper Text"
          value="Brandon"
          helperText="Some really long helper text that we expect to wrap."
        />
        <TestTextField
          label="Name Helper Paragraph"
          value="Brandon"
          helperText={
            <div>
              sentence one <br /> sentence two
            </div>
          }
        />
        <ValidationTextField value="not a valid email" label="Email" />
        <ValidationTextField
          label="Name"
          value="Brandon"
          helperText="Some really long helper text that we expect to wrap."
        />
        <TestTextField label="Name Clearable" value="Brandon" clearable />
      </div>

      <div css={Css.df.fdc.childGap2.$}>
        <h1 css={Css.lg.$}>Compact</h1>
        <TestTextField compact value="" label="Name" hideLabel />
        <TestTextField compact value="Brandon" label="Name" inlineLabel />
        <TestTextField compact label="Name" value="" />
        <TestTextField compact label="Name" value="Brandon" />
        <TestTextField compact label="Name" value="Brandon" disabled />
        <TestTextField
          compact
          label="Name"
          value="Brandon"
          helperText="Some really long helper text that we expect to wrap."
        />
        <ValidationTextField compact value="not a valid email" label="Email" />
        <TestTextField compact label="Name Clearable" value="Brandon" clearable />
      </div>
    </div>
  );
}

export function TextFieldReadOnly() {
  return (
    <div css={Css.df.childGap2.$}>
      <div css={Css.df.fdc.childGap3.$}>
        <b>Read Only</b>
        <TestTextField label="Name" value="first" readOnly={true} />
        <TestTextField label="Name" value="first" inlineLabel readOnly={true} />
        <TestTextField label="Name" value="first" hideLabel readOnly={true} />
        <TestTextField label="Name" value={"first ".repeat(20) + "last"} readOnly={true} />
      </div>
      {/*Matching column but w/o readOnly for comparison*/}
      <div css={Css.df.fdc.childGap3.$}>
        <b>Editable</b>
        <TestTextField label="Name" value="first" />
        <TestTextField label="Name" value="first" inlineLabel />
        <TestTextField label="Name" value="first" hideLabel />
        <TestTextField label="Name" value={"first ".repeat(20) + "last"} />
      </div>
    </div>
  );
}

function TestTextField(props: Omit<TextFieldProps, "onChange">) {
  const { value, ...otherProps } = props;
  const [internalValue, setValue] = useState(value);
  return (
    <TextField
      value={internalValue}
      onChange={setValue}
      {...otherProps}
      onBlur={action("onBlur")}
      onFocus={action("onFocus")}
    />
  );
}

function ValidationTextField(props: Omit<TextFieldProps, "onChange">) {
  const { value, ...otherProps } = props;
  const [internalValue, setValue] = useState<string | undefined>(value);
  // Validates that the input's value is a properly formatted email address.
  const isValid = useMemo(
    () => internalValue && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(internalValue),
    [internalValue],
  );
  return (
    <TextField
      {...otherProps}
      value={internalValue}
      onChange={setValue}
      errorMsg={!isValid ? "The email address entered is invalid. Please provide a valid email address." : undefined}
      onBlur={action("onBlur")}
      onFocus={action("onFocus")}
    />
  );
}
