import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "@ve/ui";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md"] },
    disabled: { control: "boolean" }
  },
  args: { "aria-label": "Notifications", size: "md" }
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function ControlledSwitch() {
    const [checked, setChecked] = useState(true);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Switch aria-label="Dark mode" checked={checked} onCheckedChange={setChecked} />
        <span>{checked ? "Enabled" : "Disabled"}</span>
      </div>
    );
  }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <Switch aria-label="Small" size="sm" defaultChecked />
      <Switch aria-label="Medium" size="md" defaultChecked />
    </div>
  )
};
