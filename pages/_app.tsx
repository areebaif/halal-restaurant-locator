import * as React from "react";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ltrCache } from "@/ltr-cache";
import { SessionProvider } from "next-auth/react";
import { AppChrome, AppChromeAdmin } from "@/components";

export default function App({
  Component,
  router,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS emotionCache={ltrCache}>
      <SessionProvider session={session}>
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
      </SessionProvider>
    </MantineProvider>
  );
}
