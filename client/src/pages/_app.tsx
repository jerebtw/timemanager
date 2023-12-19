import { PocketBaseProvider } from "@/context/pocketbase";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.layer.css";
import "@mantine/dates/styles.layer.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.layer.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";

const theme = createTheme({
  defaultRadius: "md",
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
  },
});

const queryClient = new QueryClient();
export default function App({ Component, pageProps }: AppProps) {
  return (
    <PocketBaseProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <Notifications />

          <ModalsProvider>
            <Component {...pageProps} />
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </PocketBaseProvider>
  );
}
