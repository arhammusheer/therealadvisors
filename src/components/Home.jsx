import {
  Box,
  Button,
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
    <Box bgGradient={"radial(purple.600, red.500 , blue.600)"}>
      <Box h={"100vh"}>
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
      <Box
        h={"100%"}
        bg={useColorModeValue("#FFFFFFA0", "#1A202CB0")}
        p={{
          base: 0,
          sm: 4,
          md: 8,
          lg: 12,
          xl: 16,
        }}
      >
        <Box
          p={8}
          py={40}
          bg={useColorModeValue("#FFFFFF", "#1A202C")}
          h={"100%"}
          borderRadius={{
            base: "none",
            sm: "lg",
            md: "2xl",
          }}
        >
          <Heading fontFamily={"Bebas Neue"} size={"2xl"}>
            An Easier Way to verify
          </Heading>
          <Text fontSize={"lg"}>
            Tired of waiting for mods to respond to your requests for
            verification? <br />
            We've made it easier for you to verify your account.
          </Text>

          <Flex mt={8} direction={"column"}>
            <Text fontSize={"3xl"} my={4} fontWeight={"bold"}>
              Step 1
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
            <Text fontSize={"3xl"} mt={4} fontWeight={"bold"}>
              Step 2
            </Text>
            <Text fontSize={"lg"}>
              Enter Your .edu Email Address and we'll send you a link to verify
              your account.
            </Text>
            <Text fontSize={"3xl"} mt={4} fontWeight={"bold"}>
              Step 3
            </Text>
            <Text fontSize={"lg"}>
              Once you click the link, we sent you on your edu email, we'll
              automatically add the verified role to your account.
            </Text>

            <br />
            <Text fontSize={"lg"} mt={4} fontWeight={"bold"}>
              Wasn't this easy?
            </Text>

            <Text fontSize={"md"}>
              Tell us how we can make it even easier or have any other feedback
              or questions on discord. :)
            </Text>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
