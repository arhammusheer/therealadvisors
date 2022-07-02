import {
  Box,
  Button,
  Flex,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Home() {
  const MotionFlex = motion(Flex);
  return (
    <Box bgGradient={"radial(purple.600, red.500 , blue.600)"}>
      <MotionFlex
        align={"center"}
        justify={"center"}
        direction={"column"}
        h={"100vh"}
        animate="in"
        initial="initial"
        maxW={"100vw"}
        bg={useColorModeValue("#FFFFFFA0", "#1A202CB0")}
        exit="out"
        variants={{
          initial: { opacity: 0.5 },
          in: { opacity: 1 },
          out: { opacity: 0 },
        }}
        transition={{ duration: 1 }}
      >
        <Box>
          <Text
            fontSize={{ base: "100px", md: "200px" }}
            fontFamily={"Bebas Neue"}
            lineHeight={"0.9"}
            textAlign={"center"}
          >
            The
            <br />
            <Box bgGradient="linear(to-l, #347eeb,#cf2d08)" bgClip="text">
              Real
              <br />
              Advisors
            </Box>
          </Text>
        </Box>
        <Box>
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
        </Box>
      </MotionFlex>
    </Box>
  );
}
