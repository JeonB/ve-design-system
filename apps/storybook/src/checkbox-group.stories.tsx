import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CheckboxGroup } from "@ve/ui";

const meta = {
  title: "Components/CheckboxGroup",
  parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function DefaultGroup() {
    const [roles, setRoles] = useState<string[]>(["editor"]);
    return (
      <CheckboxGroup legend="Roles" name="roles" value={roles} onValueChange={setRoles}>
        <CheckboxGroup.Item value="admin">Admin</CheckboxGroup.Item>
        <CheckboxGroup.Item value="editor">Editor</CheckboxGroup.Item>
        <CheckboxGroup.Item value="viewer">Viewer</CheckboxGroup.Item>
      </CheckboxGroup>
    );
  }
};
