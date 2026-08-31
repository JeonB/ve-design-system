import type { Meta, StoryObj } from "@storybook/react";
import { Button, Card, Field, Input } from "@ve/ui";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "outline", "muted"]
    },
    padding: {
      control: "select",
      options: ["sm", "md", "lg"]
    },
    fullWidth: { control: "boolean" }
  },
  args: {
    variant: "elevated",
    padding: "md",
    children: "Card content"
  }
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  render: (args) => (
    <Card {...args} style={{ width: "320px" }}>
      <Card.Header>
        <Card.Title>Workspace</Card.Title>
        <Card.Description>Shared settings for your team.</Card.Description>
      </Card.Header>
      <Card.Body>Members can manage integrations and billing from this surface.</Card.Body>
      <Card.Footer>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </Card.Footer>
    </Card>
  )
};

export const Outline: Story = {
  args: { variant: "outline" },
  render: Elevated.render
};

export const Muted: Story = {
  args: { variant: "muted" },
  render: Elevated.render
};

export const WithForm: Story = {
  render: () => (
    <Card fullWidth style={{ width: "360px" }}>
      <Card.Header>
        <Card.Title>Invite teammate</Card.Title>
        <Card.Description>Send an email invitation to join this workspace.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Field fullWidth>
          <Field.Label>Email</Field.Label>
          <Input name="email" placeholder="alex@company.com" type="email" />
        </Field>
      </Card.Body>
      <Card.Footer>
        <Button type="button" fullWidth>
          Send invite
        </Button>
      </Card.Footer>
    </Card>
  )
};
