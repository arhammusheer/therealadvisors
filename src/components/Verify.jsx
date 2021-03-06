import { Box, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Verify() {
  const [title, setTitle] = useState("Verifying your user");
  const [message, setMessage] = useState(
    "Please wait while we process your request"
  );
  const { token } = useParams();

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    async function verification() {
      await axios({
        url: `/api/verify`,
        method: "GET",
        params: { token: token },
      })
        .then(() => {
          setIsLoaded(true);
          setTitle(`Success: Role added`);
          setMessage(`A verification role has been added to your user`);
        })
        .catch(() => {
          setIsLoaded(true);
          setTitle(`Error: Failed verfication`);
          setMessage(`The token provided is invalid`);
        });
    }
    verification();
  }, [token]);
  return (
    <Flex align={"center"} height={"100vh"} justify={"center"}>
      <Spinner hidden={isLoaded} size={"xl"} />
      <Box>
        <Heading size={"2xl"}>{title}</Heading>
        <Text fontSize={"xl"}>{message}</Text>
      </Box>
    </Flex>
  );
}
