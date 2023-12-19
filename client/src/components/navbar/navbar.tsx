import { PocketBaseContext } from "@/context/pocketbase";
import {
  AppShell,
  Burger,
  Button,
  Center,
  Divider,
  Group,
  NavLink,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  IconBook,
  IconCalendar,
  IconClock,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ReactNode, useContext } from "react";
const Login = dynamic(() => import("@/components/login/login"), { ssr: false });
const Loading = dynamic(() => import("@/components/loading/loading"), {
  ssr: false,
});

const pages = [
  {
    title: "Booking",
    href: "/",
    icon: IconBook,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: IconCalendar,
  },
];

export default function Navbar({
  title,
  children,
  padding = "md",
}: {
  title: string;
  children: ReactNode;
  padding?: string | number;
}) {
  const [opened, { toggle }] = useDisclosure();
  const { auth, logout, loading } = useContext(PocketBaseContext);

  function isPageActive(href: string) {
    return href === window.location.pathname;
  }

  return (
    <>
      <Head>
        <title>{`${title} | TimeManager`}</title>
      </Head>

      <AppShell
        header={{ height: 60 }}
        navbar={
          !auth || loading
            ? undefined
            : { width: 150, breakpoint: "sm", collapsed: { mobile: !opened } }
        }
        padding={padding}>
        <AppShell.Header>
          <Group px="sm" h="100%" justify="space-between">
            <Center>
              <Group gap="xs">
                <IconClock size={30} />
                <Title order={4}>TimeManager</Title>
              </Group>
            </Center>

            <Group visibleFrom="sm">
              {auth && (
                <Button
                  color="red"
                  leftSection={<IconLogout size={16} />}
                  onClick={() => {
                    logout!();
                    showNotification({
                      title: "Success",
                      message: "You were logged out",
                      color: "green",
                      withBorder: true,
                    });
                  }}>
                  Logout
                </Button>
              )}
            </Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
        </AppShell.Header>
        {auth && (
          <AppShell.Navbar>
            {pages.map((page, index) => (
              <NavLink
                key={index}
                variant="filled"
                active={isPageActive(page.href)}
                label={page.title}
                href={page.href}
                leftSection={<page.icon size={16} />}
              />
            ))}

            <Divider label="Admin" />

            <NavLink
              variant="filled"
              label="Users"
              href="/users"
              leftSection={<IconUser size={16} />}
            />
          </AppShell.Navbar>
        )}
        <AppShell.Main>
          {loading ? <Loading fullHeight /> : !auth ? <Login /> : children}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
