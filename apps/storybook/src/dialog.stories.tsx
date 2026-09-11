import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button, Dialog } from "@ve/ui";

const meta = {
  title: "Components/Dialog",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {
  render: function ConfirmDialog() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Delete</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <Dialog.Content>
            <Dialog.Close />
            <Dialog.Header>
              <Dialog.Title>Delete project?</Dialog.Title>
              <Dialog.Description>This action cannot be undone.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Delete
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>
      </>
    );
  }
};
