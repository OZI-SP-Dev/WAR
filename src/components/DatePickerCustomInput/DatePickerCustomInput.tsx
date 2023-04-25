import { forwardRef } from "react";
import { Form } from "react-bootstrap";

type IDatePickerCustomInput = {
  label?: string;
  value?: string | number | string[];
  openPicker: () => void;
  required?: boolean;
  readOnly?: boolean;
};

export const DatePickerCustomInput = forwardRef<
  HTMLInputElement,
  IDatePickerCustomInput
>((props, ref) => (
  <>
    <Form.Label>{props.label}</Form.Label>
    <Form.Control
      style={{ backgroundColor: "transparent" }}
      ref={ref}
      type="text"
      value={props.value}
      onClick={props.openPicker}
      required={props.required}
      readOnly
      // Manual input is disabled, you MUST use the overlay
      // Following line removes the console warning in dev
      onChange={() => {}}
    />
  </>
));
