import type { Meta, StoryObj } from "@storybook/react";
import { Field, Select } from "@ve/ui";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" }
  },
  args: { name: "plan", size: "md", "aria-label": "Plan" }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <option value="free">Free</option>
      <option value="pro">Pro</option>
      <option value="enterprise">Enterprise</option>
    </Select>
  )
};

export const WithField: Story = {
  render: () => (
    <Field fullWidth style={{ width: "280px" }}>
      <Field.Label>Plan</Field.Label>
      <Select name="plan" defaultValue="pro">
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </Select>
      <Field.Description>You can change this later.</Field.Description>
    </Field>
  )
};

export const Invalid: Story = {
  render: () => (
    <Field invalid required fullWidth style={{ width: "280px" }}>
      <Field.Label>Region</Field.Label>
      <Select name="region" defaultValue="">
        <option value="" disabled>
          Select a region
        </option>
        <option value="kr">Korea</option>
        <option value="us">United States</option>
      </Select>
      <Field.Error>Choose a region to continue.</Field.Error>
    </Field>
  )
};
