import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "./button";
import { Card } from "./card";
import { ThemeProvider } from "../theme/theme-provider";

afterEach(() => {
  cleanup();
});

describe("Card", () => {
  it("compound 슬롯을 렌더한다", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Profile</Card.Title>
          <Card.Description>Account details</Card.Description>
        </Card.Header>
        <Card.Body>Body content</Card.Body>
        <Card.Footer>
          <Button size="sm">Save</Button>
        </Card.Footer>
      </Card>
    );

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Account details")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("variant와 padding 메타데이터를 노출한다", () => {
    const { container } = render(
      <Card variant="outline" padding="lg">
        Content
      </Card>
    );

    const root = container.querySelector('[data-slot="card"]');
    expect(root).toHaveAttribute("data-variant", "outline");
    expect(root).toHaveAttribute("data-padding", "lg");
  });

  it("dark 테마에서도 렌더된다", () => {
    render(
      <ThemeProvider forcedMode="dark" storageKey="ve-card-theme">
        <Card variant="muted">
          <Card.Title>Dark card</Card.Title>
        </Card>
      </ThemeProvider>
    );

    expect(screen.getByText("Dark card")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });
});
