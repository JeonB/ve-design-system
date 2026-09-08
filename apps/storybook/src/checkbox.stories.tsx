import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox, Field } from "@ve/ui";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    indeterminate: { control: "boolean" }
  },
  args: { "aria-label": "Accept", size: "md" }
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithField: Story = {
  render: () => (
    <Field>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checkbox name="tos" />
        <Field.Label>I agree to the terms</Field.Label>
      </div>
      <Field.Description>Required to continue.</Field.Description>
    </Field>
  )
};

export const Controlled: Story = {
  render: function ControlledCheckbox() {
    const [checked, setChecked] = useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Checkbox
          aria-label="Notifications"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <span>{checked ? "On" : "Off"}</span>
      </div>
    );
  }
};

export const Indeterminate: Story = {
  args: { indeterminate: true, defaultChecked: true, "aria-label": "Select all" }
};
