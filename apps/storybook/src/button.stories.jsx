import { Button } from "@ve/ui";

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Button",
  },
};

export default meta;

export const Solid = {
  args: {
    variant: "solid",
    size: "md",
  },
};

export const OutlineSmall = {
  args: {
    variant: "outline",
    size: "sm",
    children: "Outline",
  },
};
