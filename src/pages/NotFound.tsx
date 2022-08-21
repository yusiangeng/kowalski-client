import { Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Stack align="center" mt={64}>
      <Text>Page not found :/</Text>
      <Link to="/">Go back</Link>
    </Stack>
  );
};
export default NotFound;
