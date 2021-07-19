import { ArrowRightIcon, ChatIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  Link,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "./Loading";
import * as swot from "swot-node";
import Error from "./Error";

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
      .catch((err) => {
        console.log(err);
        setData({
          error: { code: 401, message: "Token has expired, Login again." },
        });
        setLoading(false);
      });
  }, []);
  if (loading) {
    return <Loading />;
  }

  if (data.error) {
    return <Error error={data.error} />;
  }
  if (!data.isInServer) {
    return (
      <Flex align={"center"} justify={"center"} h={"100vh"} m={3}>
        <Stack direction={{ base: "column", md: "row" }} spacing={"1rem"}>
          <NotInServerComponent user={data} />
          <UserCard user={data} />
        </Stack>
      </Flex>
    );
  }
  return (
    <Flex align={"center"} justify={"center"} h={"100vh"} m={3}>
      <Stack direction={{ base: "column", md: "row" }} spacing={"1rem"}>
        <UserCard user={data} />
        <IsInServerComponent user={data} />
      </Stack>
    </Flex>
  );
}

function NotInServerComponent({ user }) {
  return (
    <Stack
      align={"center"}
      direction={{ base: "column", md: "row" }}
      boxShadow={"lg"}
      borderRadius={"xl"}
      p={"5"}
      border
      borderWidth={1}
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

function EmailForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [buttonColor, setButtonColor] = useState("blue");
  const [isAcademic, setIsAcademic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
    if (isAcademic) {
      setIsLoading(true);
      axios
        .post("/api/email", { email: email })
        .then((response) => {
          setIsLoading(false);
          if (response.data === "User already verified") {
            toast({
              title: "User is already verified",
              description: "A verified role already exists on your user.",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
            setButtonColor("orange");
          } else {
            toast({
              title: "Email Sent",
              description:
                "Your verification request has been submitted. Please check your college email.",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setButtonColor("green");
          }
        })
        .catch((err) => {
          setIsLoading(false);
          toast({
            title: "An Error occured",
            description:
              "We could not process your email. Please try again later.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          console.log(err);
          setButtonColor("red");
        });
    } else {
      toast({
        title: "Email is Non Academic",
        description:
          "The email you entered is not academic. If you're facing trouble, we request to apply for verification manually",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
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
            required
          />

          <Button
            borderRadius={"md"}
            ml={1}
            isLoading={isLoading}
            type={"submit"}
            colorScheme={buttonColor}
          >
            <ArrowRightIcon />
          </Button>
        </InputGroup>
        <Text fontSize={"sm"} color={"red.400"} hidden={isAcademic}>
          Enter an academic email
        </Text>
      </form>
    </Stack>
  );
}

function DocumentForm({ user }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const formData = new FormData();
  const toast = useToast();

  function handleFile(event) {
    console.log(event.target.files[0]);
    if (event.target.files[0].size > 2 * 1024 * 1024) {
      setIsDisabled(true);
      toast({
        title: "File size is too large",
        description: "The file size limit is set to 2MB",
        status: "warning",
        isClosable: true,
      });
    } else {
      setIsDisabled(false);
      setFile(event.target.files[0]);
    }
  }
  async function handleForm(event) {
    setIsLoading(true);
    event.preventDefault();

    formData.append("file", file);

    await axios
      .post("/api/verify-using-docs", formData)
      .then((response) => {
        console.log(response);
        toast({
          title: "Your request has been submitted",
          description:
            "Please wait while the mods review your verification request.",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.log(err);
        toast({
          title: "An error occured",
          description:
            "We could not submit your verification request due to an internal error. Please try again later.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      })
      .then(() => {
        setIsLoading(false);
      });
  }

  return (
    <Stack direction={"column"} align={"center"}>
      <ChatIcon w={"70px"} h={"70px"} />
      <Text fontSize={"lg"}>Verify Using Documents</Text>
      <form onSubmit={handleForm}>
        <InputGroup>
          <Input
            name={"college-document"}
            type={"file"}
            accept={"image/*, application/pdf"}
            multiple={false}
            onChange={handleFile}
            required
            style={{ display: "flex", alignItems: "center" }}
          />
          <Tooltip
            label="Hey, I'm here!"
            aria-label="A tooltip"
            isDisabled={isDisabled}
          >
            <Button
              borderRadius={"md"}
              ml={1}
              type={"submit"}
              isLoading={isLoading}
              isDisabled={isDisabled}
            >
              <ArrowRightIcon />
            </Button>
          </Tooltip>
        </InputGroup>
        <Text fontSize={"sm"} color={"red.400"} hidden={!isDisabled}>
          File size is limited to 2MB
        </Text>
      </form>
    </Stack>
  );
}

function IsInServerComponent({ user }) {
  return (
    <Stack
      border
      borderWidth={1}
      align={"center"}
      direction={{ base: "column", md: "row" }}
      boxShadow={"lg"}
      borderRadius={"xl"}
      p={"5"}
    >
      <EmailForm />
      <Box
        bgColor={useColorModeValue("gray.200", "gray.600")}
        w={{ base: "100%", sm: "1px" }}
        h={{ base: "1px", sm: "100%" }}
      >
        &nbsp;
      </Box>
      <VerifyUsingDM user={user} />
    </Stack>
  );
}

function UserCard({ user }) {
  return (
    <Stack
      border
      borderWidth={1}
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

function VerifyUsingDM({ user }) {
  return (
    <Stack direction={"column"} align={"center"}>
      <ChatIcon w={"70px"} h={"70px"} />
      <Text fontSize={"lg"}>Verify Using Documents</Text>
      <Box p={1} m={1}>
        <Text
          color={useColorModeValue("gray.600", "gray.400")}
          align={"justify"}
        >
          To verify using documents, Please DM ModMail/StaffMail
        </Text>
      </Box>
    </Stack>
  );
}
