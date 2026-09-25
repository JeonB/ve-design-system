import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Card, Tabs } from "@ve/ui";

const meta = {
  title: "Components/Tabs",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultTabs() {
    const [value, setValue] = useState("general");
    return (
      <Card style={{ width: "360px" }}>
        <Tabs value={value} onValueChange={setValue}>
          <Tabs.List aria-label="Settings">
            <Tabs.Trigger value="general">General</Tabs.Trigger>
            <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
            <Tabs.Trigger value="team">Team</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="general">Workspace name and locale.</Tabs.Content>
          <Tabs.Content value="billing">Plan and invoices.</Tabs.Content>
          <Tabs.Content value="team">Members and roles.</Tabs.Content>
        </Tabs>
      </Card>
    );
  }
};
