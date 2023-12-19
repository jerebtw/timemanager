import { Button, Center, Notification, Stack } from "@mantine/core";
import { IconReload } from "@tabler/icons-react";
import { useRouter } from "next/router";

export default function ErrorNotification({
  fullHeight,
}: {
  fullHeight?: boolean;
}) {
  const router = useRouter();

  return (
    <Center h={fullHeight ? "90vh" : undefined}>
      <Notification
        title="Error"
        color="red"
        withCloseButton={false}
        withBorder>
        <Stack gap={4}>
          There was an error. Please try again later.
          <Button
            variant="default"
            leftSection={<IconReload size={16} />}
            onClick={router.reload}>
            Reload
          </Button>
        </Stack>
      </Notification>
    </Center>
  );
}
