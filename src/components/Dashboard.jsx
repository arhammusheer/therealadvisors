import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState({});
  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  }, []);
  if (!data.isInServer) {
    return <NotInServerComponent user={data} />;
  }
  return JSON.stringify(data);
}

function NotInServerComponent({ user }) {
  return (
    <Flex align={"center"} justify={"center"} h={"100vh"}>
      <Container>
        <Stack direction={["column", "row"]} spacing={"2rem"}>
          <Stack
            align={"center"}
            direction={["column", "row"]}
            shadow={"xl"}
            borderRadius={"xl"}
            p={"5"}
          >
            <Avatar
              name={"The Real Advisors"}
              src={"./logo-500.png"}
              bg={"transparent"}
              size={"xl"}
            />
            <Box>
              <Heading>The Real Advisors</Heading>
              <Text>Connect with other people applying abroad.</Text>

              <Button mt={3}
                as={Link}
                href={"https://discord.gg/jQUpuSmDwM"}
                colorScheme={"blue"}
              >
                Join the discord server
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Container>
    </Flex>
  );
}
