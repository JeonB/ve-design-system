import type { Meta, StoryObj } from "@storybook/react";
import { Button, Stack, ToastProvider, useToast } from "@ve/ui";

const meta: Meta = {
  title: "Components/Toast",
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    )
  ]
};

export default meta;
type Story = StoryObj;

function Demo() {
  const { toast } = useToast();
  return (
    <Stack gap="sm">
      <Button
        onClick={() => toast({ title: "Saved", description: "Draft updated.", variant: "success" })}
      >
        Success
      </Button>
      <Button
        variant="danger"
        onClick={() => toast({ title: "Failed", description: "Try again.", variant: "danger" })}
      >
        Danger
      </Button>
    </Stack>
  );
}

export const Default: Story = {
  render: () => <Demo />
};
