import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <Flex align={"center"} height={"100vh"}>
      <Container>
        <Box>
          <Heading size={"4xl"}>404</Heading>
          <Text fontSize={"3xl"}>Page Not Found</Text>
					<Link to={"/"}>Click here to go back ✨home✨</Link>
        </Box>
      </Container>
    </Flex>
  );
}
