import type { Meta, StoryObj } from "@storybook/react";
import { Field, Textarea } from "@ve/ui";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    resize: {
      control: "select",
      options: ["none", "vertical", "both"]
    },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" }
  },
  args: {
    placeholder: "Write a short update…",
    size: "md",
    name: "notes",
    rows: 4
  }
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "12px", width: "320px" }}>
      <Textarea name="sm" placeholder="Small" size="sm" fullWidth />
      <Textarea name="md" placeholder="Medium" size="md" fullWidth />
      <Textarea name="lg" placeholder="Large" size="lg" fullWidth />
    </div>
  )
};

export const FieldComposition: Story = {
  render: () => (
    <Field fullWidth style={{ width: "320px" }}>
      <Field.Label>Release notes</Field.Label>
      <Textarea name="notes" placeholder="What changed in this release?" />
      <Field.Description>Markdown is supported in the product app.</Field.Description>
    </Field>
  )
};

export const Invalid: Story = {
  render: () => (
    <Field invalid required fullWidth style={{ width: "320px" }}>
      <Field.Label>Feedback</Field.Label>
      <Textarea name="feedback" defaultValue="ok" resize="none" />
      <Field.Error>Please provide at least 20 characters.</Field.Error>
    </Field>
  )
};
