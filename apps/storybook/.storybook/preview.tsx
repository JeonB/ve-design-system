import type { Preview, ReactRenderer } from "@storybook/react";
import type { Decorator } from "@storybook/react";
import { ThemeProvider, type ThemeMode } from "@ve/ui";
import { vars } from "@ve/tokens";
import "@ve/tokens";

const withTheme: Decorator<ReactRenderer> = (Story, context) => {
  const theme = (context.globals.theme as ThemeMode | undefined) ?? "light";
  const forcedMode = theme === "system" ? undefined : theme;

  return (
    <ThemeProvider key={theme} defaultMode={theme} forcedMode={forcedMode} storageKey="ve-storybook-theme">
      <div
        style={{
          background: vars.color.background,
          color: vars.color.foreground,
          minHeight: "100vh",
          padding: "24px",
          boxSizing: "border-box",
          fontFamily: vars.font.body
        }}
      >
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Color mode for VE Design System",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "system", title: "System", icon: "browser" }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    backgrounds: { disable: true },
    layout: "fullscreen"
  }
};

export default preview;
