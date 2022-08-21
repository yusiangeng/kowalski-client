import {
  ActionIcon,
  Button,
  Container,
  Group,
  Header,
  Image,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { getCurrentUser } from "../api/users";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: user } = useQuery(["user"], getCurrentUser, {
    retry: false
  });
  const queryClient = useQueryClient();

  return (
    <>
      <Container size="md">
        <Header height={64} pt={16}>
          <Group position="apart">
            <Group>
              <Group>
                <Image src="/sleeping.png" height={36} />
              </Group>
              <Title>Kowalski</Title>
            </Group>
            <Group>
              <Text>{user?.email && `Logged in as ${user.email}`}</Text>
              <ColorSchemeButton />
              {user && (
                <Button
                  compact
                  variant="light"
                  sx={{ height: 28 }}
                  onClick={() => {
                    localStorage.removeItem("token");
                    queryClient.setQueryData(["user"], null);
                    queryClient.invalidateQueries(["user"]);
                    toast.success("Successfully logged out!");
                  }}
                >
                  Logout
                </Button>
              )}
            </Group>
          </Group>
        </Header>
        {children}
      </Container>
    </>
  );
};

export default Layout;

const ColorSchemeButton = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="outline"
      color={"pink"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size={18} /> : <IconMoon size={18} />}
    </ActionIcon>
  );
};
