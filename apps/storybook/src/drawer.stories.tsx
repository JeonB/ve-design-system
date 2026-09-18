import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button, Drawer, Stack, Switch } from "@ve/ui";

const meta = {
  title: "Components/Drawer",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: function RightDrawer() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open settings</Button>
        <Drawer open={open} onOpenChange={setOpen} side="right">
          <Drawer.Content>
            <Drawer.Close />
            <Drawer.Header>
              <Drawer.Title>Settings</Drawer.Title>
              <Drawer.Description>Workspace preferences</Drawer.Description>
            </Drawer.Header>
            <Drawer.Body>
              <Stack gap="md">
                <Stack direction="horizontal" justify="between" align="center">
                  <span>Email alerts</span>
                  <Switch aria-label="Email alerts" defaultChecked />
                </Stack>
              </Stack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer>
      </>
    );
  }
};
