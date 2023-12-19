import ErrorNotification from "@/components/errorNotification/errorNotification";
import Loading from "@/components/loading/loading";
import Navbar from "@/components/navbar/navbar";
import { PocketBaseContext } from "@/context/pocketbase";
import {
  BookingCollection,
  BookingTypeCollection,
} from "@/pocketbase/collections";
import { BookingType } from "@/pocketbase/types";
import {
  ActionIcon,
  Box,
  Center,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useContext } from "react";

export default function Home() {
  const { auth, loading, pocketBase } = useContext(PocketBaseContext);

  const query = useQuery({
    queryKey: ["bookingTypes"],
    queryFn: async () => {
      return await pocketBase!
        .collection(BookingTypeCollection)
        .getList<BookingType>();
    },
    enabled: !loading && !!auth && !!pocketBase,
  });

  async function createBooking(type: BookingType) {
    try {
      await pocketBase!.collection(BookingCollection).create({
        type: type.id,
        timestamp: new Date(),
        updatedBy: auth!.id,
        createdBy: auth!.id,
      });
      showNotification({
        title: "Booking created",
        message: `Booking ${type.text} created`,
        color: "green",
        withBorder: true,
      });
    } catch (e) {
      console.error(e);
      showNotification({
        title: "Booking creation failed",
        message: `Booking ${type.text} creation failed`,
        color: "red",
        withBorder: true,
      });
    }
  }

  return (
    <Navbar title="Booking">
      {query.isFetching ? (
        <Box pr={150}>
          <Loading fullHeight />
        </Box>
      ) : query.isError ? (
        <ErrorNotification fullHeight />
      ) : (
        <Center>
          <SimpleGrid cols={5}>
            {query.data?.items.map((item, index) => (
              <ActionIcon
                key={index}
                size={160}
                variant="default"
                onClick={async () => {
                  modals.openConfirmModal({
                    title: "Confirm booking",
                    children: `Are you sure you want to book ${item.text}?`,
                    labels: {
                      cancel: "Cancel",
                      confirm: "Confirm",
                    },
                    confirmProps: {
                      color: "green",
                    },
                    centered: true,
                    onConfirm: () => createBooking(item),
                  });
                }}>
                <Stack>
                  <Image
                    alt="Icon"
                    src={pocketBase!.getFileUrl(item, item.icon)}
                    loading="lazy"
                    height={50}
                    width={50}
                    style={{
                      borderRadius: 16,
                    }}
                  />
                  <Text size="xl" ta="center">
                    {item.text}
                  </Text>
                </Stack>
              </ActionIcon>
            ))}
          </SimpleGrid>
        </Center>
      )}
    </Navbar>
  );
}
