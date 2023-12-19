import { Center, Loader } from "@mantine/core";

export default function Loading({ fullHeight }: { fullHeight?: boolean }) {
  return (
    <Center h={fullHeight ? "90vh" : undefined}>
      <Loader type="oval" color="blue" />
    </Center>
  );
}
