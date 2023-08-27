import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { ltrCache } from "@/ltr-cache";
import { AppChrome } from "@/components/layout/AppChrome";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppChrome>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        emotionCache={ltrCache}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </AppChrome>
  );
}
