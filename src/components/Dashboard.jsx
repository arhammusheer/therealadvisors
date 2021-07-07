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
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  if (loading) {
    return <Loading />;
  }

  if (!data.isInServer) {
    return (
      <Flex align={"center"} justify={"center"} h={"100vh"}>
        <Container>
          <Stack direction={["column", "row"]} spacing={"2rem"}>
            <NotInServerComponent user={data} />
            <UserCard user={data} />
          </Stack>
        </Container>
      </Flex>
    );
  }
  return (
    <Flex align={"center"} justify={"center"} h={"100vh"}>
      <Container>
        <Stack direction={["column", "row"]} spacing={"2rem"}>
          <IsInServerComponent user={data} />
          <UserCard user={data} />
        </Stack>
      </Container>
    </Flex>
  );
}

function NotInServerComponent({ user }) {
  return (
    <Stack
      align={"center"}
      direction={["column", "row"]}
      boxShadow={"lg"}
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

        <Button
          mt={3}
          as={Link}
          href={"https://discord.gg/jQUpuSmDwM"}
          colorScheme={"blue"}
        >
          Join the discord server
        </Button>
      </Box>
    </Stack>
  );
}

function IsInServerComponent({ user }) {
  return "user";
}

function UserCard({ user }) {
  return (
    <Stack
      align={"center"}
      direction={"column"}
      boxShadow={"lg"}
      borderRadius={"xl"}
      p={"5"}
    >
      <Avatar
        name={user.username}
        src={`${user.avatar}?size=1024`}
        bg={"transparent"}
        size={"xl"}
      />
      <Text>Hey There</Text>
      <Heading size={"md"}>
        {user.username}#{user.discriminator}
      </Heading>
    </Stack>
  );
}
