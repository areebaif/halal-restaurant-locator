import * as React from "react";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ltrCache } from "@/ltr-cache";
import { AppChrome, AppChromeAdmin } from "@/components";

export default function App({ Component, pageProps, router }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={ltrCache}>
      <QueryClientProvider client={queryClient}>
        {router.route.startsWith("/admin") ? (
          <AppChromeAdmin>
            <Component {...pageProps} />
          </AppChromeAdmin>
        ) : (
          <AppChrome>
            <Component {...pageProps} />
          </AppChrome>
        )}
      </QueryClientProvider>
    </MantineProvider>
  );
}
