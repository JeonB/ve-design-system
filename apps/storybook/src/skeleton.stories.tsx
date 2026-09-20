import type { Meta, StoryObj } from "@storybook/react";
import { Card, Skeleton, Spinner, Stack } from "@ve/ui";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["rect", "circle"]
    }
  },
  args: {
    variant: "rect",
    width: "200px",
    height: "1rem"
  }
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rect: Story = {};

export const Circle: Story = {
  args: {
    variant: "circle",
    width: "40px",
    height: "40px"
  }
};

export const CardPlaceholder: Story = {
  render: () => (
    <Card style={{ width: "280px" }}>
      <Stack gap="md">
        <Stack direction="horizontal" gap="sm" align="center">
          <Skeleton variant="circle" width={40} height={40} />
          <Stack gap="sm" fullWidth>
            <Skeleton width="60%" height="0.875rem" />
            <Skeleton width="40%" height="0.75rem" />
          </Stack>
        </Stack>
        <Skeleton width="100%" height="4rem" />
        <Stack direction="horizontal" gap="sm" justify="end" align="center">
          <Spinner size="sm" label="Loading" />
          <Skeleton width="5rem" height="2rem" />
        </Stack>
      </Stack>
    </Card>
  )
};
