import type { Meta, StoryObj } from "@storybook/react";
import { Button, Field, Input } from "@ve/ui";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    invalid: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" }
  },
  args: {
    placeholder: "you@company.com",
    size: "md",
    name: "email"
  }
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "12px", width: "280px" }}>
      <Input name="sm" placeholder="Small" size="sm" fullWidth />
      <Input name="md" placeholder="Medium" size="md" fullWidth />
      <Input name="lg" placeholder="Large" size="lg" fullWidth />
    </div>
  )
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "not-an-email"
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "readonly@company.com"
  }
};

export const WithIcons: Story = {
  args: {
    leftIcon: <span>⌕</span>,
    rightIcon: <span>↵</span>,
    placeholder: "Search"
  }
};

export const FieldComposition: Story = {
  render: () => (
    <Field fullWidth style={{ width: "280px" }}>
      <Field.Label>Work email</Field.Label>
      <Input name="email" placeholder="you@company.com" />
      <Field.Description>We’ll send a confirmation to this address.</Field.Description>
    </Field>
  )
};

export const FieldError: Story = {
  render: () => (
    <Field invalid required fullWidth style={{ width: "280px" }}>
      <Field.Label>Work email</Field.Label>
      <Input name="email" defaultValue="hello" />
      <Field.Error>Enter a valid email address.</Field.Error>
    </Field>
  )
};

export const WithAction: Story = {
  render: () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      style={{ display: "grid", gap: "12px", width: "280px" }}
    >
      <Field fullWidth>
        <Field.Label>Email</Field.Label>
        <Input name="email" type="email" placeholder="you@company.com" />
      </Field>
      <Button type="submit" fullWidth>
        Continue
      </Button>
    </form>
  )
};
