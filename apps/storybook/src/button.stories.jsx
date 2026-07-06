import { useState } from "react";
import { Button, ButtonGroup, ButtonGroupSeparator } from "@ve/ui";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["solid", "secondary", "outline", "ghost", "danger", "dangerOutline", "link"]
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
};

export default meta;

export const Solid = {
  args: { variant: "solid", children: "Save changes" }
};

export const Secondary = {
  args: { variant: "secondary", children: "Secondary action" }
};

export const Outline = {
  args: { variant: "outline", children: "Cancel" }
};

export const Ghost = {
  args: { variant: "ghost", children: "More options" }
};

export const Danger = {
  args: { variant: "danger", children: "Delete account" }
};

export const DangerOutline = {
  args: { variant: "dangerOutline", children: "Remove access" }
};

export const Link = {
  args: { variant: "link", children: "Learn more" }
};

export const Sizes = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

export const WithIcons = {
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

export const IconOnly = {
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

export const Loading = {
  args: { loading: true, children: "Submit" }
};

export const LoadingWithText = {
  args: { loading: true, loadingText: "Saving…", children: "Save" }
};

export const Disabled = {
  args: { disabled: true, children: "Unavailable" }
};

export const TogglePressed = {
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

export const FullWidth = {
  render: () => (
    <div style={{ width: "320px" }}>
      <Button fullWidth>Sign in with email</Button>
    </div>
  )
};

export const AsChildLink = {
  render: () => (
    <Button asChild variant="outline">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Open documentation
      </a>
    </Button>
  )
};

export const DialogFooter = {
  render: () => (
    <ButtonGroup gap="sm">
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </ButtonGroup>
  )
};

export const AttachedToolbar = {
  render: () => (
    <ButtonGroup attached>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  )
};

export const AttachedWithSeparator = {
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

export const DestructiveConfirmation = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Cancel</Button>
      <Button variant="danger">Delete project</Button>
    </ButtonGroup>
  )
};

export const AllVariants = {
  render: () => (
    <div style={{ display: "grid", gap: "12px", minWidth: "220px" }}>
      {["solid", "secondary", "outline", "ghost", "danger", "dangerOutline", "link"].map(
        (variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        )
      )}
    </div>
  )
};

export const FormSubmit = {
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
