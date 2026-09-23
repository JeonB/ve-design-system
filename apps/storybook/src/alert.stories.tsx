import type { Meta, StoryObj } from "@storybook/react";
import { Alert, ALERT_VARIANTS, Stack } from "@ve/ui";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: [...ALERT_VARIANTS]
    }
  },
  args: {
    variant: "info",
    title: "Heads up",
    children: "Something worth reading stays on the page."
  }
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="md" style={{ width: "360px" }}>
      {ALERT_VARIANTS.map((variant) => (
        <Alert key={variant} title={variant} variant={variant}>
          Inline {variant} feedback.
        </Alert>
      ))}
    </Stack>
  )
};
