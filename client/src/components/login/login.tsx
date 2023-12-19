import { Button, Center, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconLogin } from "@tabler/icons-react";
import { useContext } from "react";
import { PocketBaseContext } from "../../context/pocketbase";

export default function Login() {
  const { login } = useContext(PocketBaseContext);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          const result = await login!(values);
          console.log(result);
          showNotification({
            title: "Success",
            message: "You were logged in",
            color: "green",
            withBorder: true,
          });
        } catch (e) {
          console.log(e);
          showNotification({
            title: "Error",
            message: "Incorrect email and/or password",
            color: "red",
            withBorder: true,
          });
        }
      })}>
      <Center h="70vh">
        <Stack>
          <TextInput label="Email" {...form.getInputProps("email")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          <Button type="submit" leftSection={<IconLogin size={16} />}>
            Login
          </Button>
        </Stack>
      </Center>
    </form>
  );
}
