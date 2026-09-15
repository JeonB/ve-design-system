import type { Meta, StoryObj } from "@storybook/react";
import { Button, Card, Separator, Stack } from "@ve/ui";

const meta = {
  title: "Components/Stack",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => (
    <Card style={{ width: "280px" }}>
      <Stack gap="md">
        <strong>Account</strong>
        <Separator />
        <Stack direction="horizontal" gap="sm" justify="between" align="center">
          <span>Plan</span>
          <Button size="sm" variant="outline">
            Change
          </Button>
        </Stack>
      </Stack>
    </Card>
  )
};
