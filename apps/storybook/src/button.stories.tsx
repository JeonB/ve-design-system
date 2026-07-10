import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonGroup, ButtonGroupSeparator, BUTTON_VARIANTS } from "@ve/ui";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: [...BUTTON_VARIANTS]
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"]
    },
    loading: { control: "boolean" },
    fullWidth: { control: "boolean" },
    disabled: { control: "boolean" },
    iconOnly: { control: "boolean" },
    pressed: { control: "boolean" }
  },
  args: {
    children: "Button",
    variant: "solid",
    size: "md"
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: { variant: "solid", children: "Save changes" }
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Secondary action" }
};

export const Outline: Story = {
  args: { variant: "outline", children: "Cancel" }
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "More options" }
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete account" }
};

export const DangerOutline: Story = {
  args: { variant: "dangerOutline", children: "Remove access" }
};

export const Link: Story = {
  args: { variant: "link", children: "Learn more" }
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      <Button
        leftIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        }
      >
        Create
      </Button>
      <Button
        variant="outline"
        rightIcon={
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      >
        Continue
      </Button>
    </div>
  )
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "12px" }}>
      <Button iconOnly aria-label="Settings" variant="outline">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M9 1.5v1.5M9 15v1.5M1.5 9H3M15 9h1.5M3.4 3.4l1.06 1.06M13.54 13.54l1.06 1.06M3.4 14.6l1.06-1.06M13.54 4.46l1.06-1.06"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </Button>
      <Button iconOnly aria-label="Add item" variant="solid">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 4v10M4 9h10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </Button>
    </div>
  )
};

export const Loading: Story = {
  args: { loading: true, children: "Submit" }
};

export const LoadingWithText: Story = {
  args: { loading: true, loadingText: "Saving…", children: "Save" }
};

export const Disabled: Story = {
  args: { disabled: true, children: "Unavailable" }
};

export const TogglePressed: Story = {
  render: function TogglePressedStory() {
    const [pressed, setPressed] = useState(false);

    return (
      <Button
        pressed={pressed}
        variant="secondary"
        onClick={() => setPressed((value) => !value)}
      >
        {pressed ? "Bold on" : "Bold off"}
      </Button>
    );
  }
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: "320px" }}>
      <Button fullWidth>Sign in with email</Button>
    </div>
  )
};

export const AsChildLink: Story = {
  render: () => (
    <Button asChild variant="outline">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open documentation
      </a>
    </Button>
  )
};

export const DialogFooter: Story = {
  render: () => (
    <ButtonGroup gap="sm">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </ButtonGroup>
  )
};

export const AttachedToolbar: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  )
};

export const AttachedWithSeparator: Story = {
  render: () => (
    <ButtonGroup attached>
      <Button variant="secondary">Edit</Button>
      <ButtonGroupSeparator />
      <Button variant="secondary" iconOnly aria-label="More">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="13" cy="8" r="1.5" />
        </svg>
      </Button>
    </ButtonGroup>
  )
};

export const DestructiveConfirmation: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Cancel</Button>
      <Button variant="danger">Delete project</Button>
    </ButtonGroup>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "12px", minWidth: "220px" }}>
      {BUTTON_VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  )
};

export const FormSubmit: Story = {
  render: () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      style={{ display: "grid", gap: "12px", width: "280px" }}
    >
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" placeholder="you@company.com" />
      <Button type="submit" fullWidth>
        Continue
      </Button>
    </form>
  )
};

export const AsyncSubmit: Story = {
  render: function AsyncSubmitStory() {
    const [loading, setLoading] = useState(false);

    return (
      <Button
        loading={loading}
        loadingText="Saving…"
        onClick={() => {
          setLoading(true);
          window.setTimeout(() => setLoading(false), 1500);
        }}
      >
        Save draft
      </Button>
    );
  }
};
