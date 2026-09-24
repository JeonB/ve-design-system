import type { Meta, StoryObj } from "@storybook/react";
import { Avatar, Stack } from "@ve/ui";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"]
    }
  },
  args: {
    alt: "Ada Lovelace",
    fallback: "AL",
    size: "md"
  }
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fallback: Story = {};

export const Sizes: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" align="center">
      <Avatar alt="Small" fallback="SM" size="sm" />
      <Avatar alt="Medium" fallback="MD" size="md" />
      <Avatar alt="Large" fallback="LG" size="lg" />
    </Stack>
  )
};
