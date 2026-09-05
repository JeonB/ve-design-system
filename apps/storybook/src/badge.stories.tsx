import type { Meta, StoryObj } from "@storybook/react";
import { BADGE_VARIANTS, Badge, Card } from "@ve/ui";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: [...BADGE_VARIANTS]
    },
    size: {
      control: "select",
      options: ["sm", "md"]
    }
  },
  args: {
    children: "Badge",
    variant: "neutral",
    size: "md"
  }
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: { variant: "neutral", children: "Neutral" }
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxWidth: "360px" }}>
      {BADGE_VARIANTS.map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  )
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Badge size="sm" variant="primary">
        sm
      </Badge>
      <Badge size="md" variant="primary">
        md
      </Badge>
    </div>
  )
};

export const OnCard: Story = {
  render: () => (
    <Card style={{ width: "280px" }}>
      <Card.Header>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
          <Card.Title>Deploy</Card.Title>
          <Badge variant="success" size="sm">
            Live
          </Badge>
        </div>
        <Card.Description>Production channel is healthy.</Card.Description>
      </Card.Header>
      <Card.Body>
        <Badge variant="warning" size="sm">
          2 warnings
        </Badge>
      </Card.Body>
    </Card>
  )
};
