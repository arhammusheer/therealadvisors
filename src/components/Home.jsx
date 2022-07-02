import {
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Home() {
  const MotionFlex = motion(Flex);
  return (
    <MotionFlex
      align={"center"}
      h={"100vh"}
      animate="in"
      initial="initial"
      exit="out"
      variants={{
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 },
      }}
      transition={{ duration: 1 }}
    >
      <Container>
        <Heading>
          <Text fontSize={{ base: "2xl", md: "4xl" }}>Welcome to</Text>
          <Text
            fontSize={{ base: "4xl", md: "6xl" }}
            bgGradient="linear(to-l, #347eeb,#cf2d08)"
            bgClip="text"
          >
            The Real Advisors
          </Text>
          <Link
            textDecoration={"none"}
            href={
              process.env.NODE_ENV === "development"
                ? ".netlify/functions/auth/discord"
                : "/api/auth/discord"
            }
          >
            <Button textDecoration={"none"}>
              Login with
              <Image
                h={"100%"}
								mx={"3"}
                src={useColorModeValue(
                  "/images/discord-logo-dark.svg",
                  "/images/discord-logo-light.svg"
                )}
              />
            </Button>
          </Link>
        </Heading>
      </Container>
    </MotionFlex>
  );
}
