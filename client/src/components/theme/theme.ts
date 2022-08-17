import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  // Defines color scheme for all components, defaults to "light"
  colorScheme: "light",

  // Default border-radius used for most elements "xs" | "sm" | "md" | "lg" | "xl" | number,
  defaultRadius: "sm",

  // Default loader used in Loader and LoadingOverlay components 'oval' | 'bars' |
  loader: "dots",

  // theme.fontFamily – controls font-family in all components except Title, Code and Kbd
  fontFamily:
    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
  // theme.headings.fontFamily – controls font-family of h1-h6 tags in Title and TypographyStylesProvider components
  headings: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
    sizes: {
      h1: {
        fontWeight: 700,
        fontSize: "3.5rem",
        lineHeight: 1.375,
      },
      h2: {
        fontWeight: 700,
        fontSize: "3rem",
        lineHeight: 1.375,
      },
      h3: {
        fontWeight: 700,
        fontSize: "2.25rem",
        lineHeight: 1.375,
      },
      h4: {
        fontWeight: 700,
        fontSize: "2rem",
        lineHeight: 1.375,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.375,
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: 1.375,
      },
    },
  },

  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5c5f66",
      "#373A40",
      "#2C2E33",
      "#25262b",
      "#1A1B1E",
      "#141517",
      "#101113",
    ],
    gray: [
      "#f1f3f5",
      "#E0E3E5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
    orange: [
      "#F8F3ED",
      "#ffe8cc",
      "#ffd8a8",
      "#ffc078",
      "#ffa94d",
      "#ff922b",
      "#fd7e14",
      "#f76707",
      "#e8590c",
      "#d9480f",
    ],
  },
};
