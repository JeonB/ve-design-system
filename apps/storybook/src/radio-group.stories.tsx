import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { RadioGroup } from "@ve/ui";

const meta = {
  title: "Components/RadioGroup",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultGroup() {
    const [plan, setPlan] = useState("pro");
    return (
      <RadioGroup legend="Plan" name="plan" value={plan} onValueChange={setPlan}>
        <RadioGroup.Item value="free">Free</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
        <RadioGroup.Item value="enterprise">Enterprise</RadioGroup.Item>
      </RadioGroup>
    );
  }
};
