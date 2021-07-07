import { ArrowRightIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import * as swot from "swot-node";

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
        <Stack direction={["column", "row"]} spacing={"1rem"}>
          <NotInServerComponent user={data} />
          <UserCard user={data} />
        </Stack>
      </Flex>
    );
  }
  return (
    <Flex align={"center"} justify={"center"} h={"100vh"}>
      <Stack direction={["column", "row"]} spacing={"1rem"}>
        <IsInServerComponent user={data} />
        <UserCard user={data} />
      </Stack>
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
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isAcademic, setIsAcademic] = useState(true);

  async function handleEmail(event) {
    setEmail(event.target.value);
    let isAcademicEmail = await swot.isAcademic(event.target.value);
    if (isAcademicEmail) {
      setIsAcademic(true);
    } else {
      setIsAcademic(false);
    }
    event.preventDefault();
  }

  function handleForm(event) {
    toast({
      title: "Email Sent",
      description:
        "Your verification request has been submitted. Please check your college email.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    event.preventDefault();
  }
  return (
    <Stack
      align={"center"}
      direction={["column", "row"]}
      boxShadow={"lg"}
      borderRadius={"xl"}
      p={"5"}
    >
      <Stack direction={"column"} align={"center"}>
        <EmailIcon w={"70px"} h={"70px"} />
        <Text fontSize={"lg"}>Verify Using College Email</Text>
        <form onSubmit={handleForm}>
          <InputGroup>
            <Input
              placeholder="john@example.edu"
              name={"college-email"}
              onChange={handleEmail}
              value={email}
              type={"email"}
              isInvalid={!isAcademic}
            />

            <IconButton borderRadius={"md"} icon={<ArrowRightIcon />} ml={1} />
          </InputGroup>
          <Text fontSize={"sm"} color={"red.400"} hidden={isAcademic}>
            Enter an academic email
          </Text>
        </form>
      </Stack>
    </Stack>
  );
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
