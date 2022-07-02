import { Box, Image } from "@chakra-ui/react";

export default function Logo() {
  return (
    <Box bg={"black"} borderRadius={"full"} boxShadow={"lg"} p={1}>
      <Image w={"50px"} name={"The Real Advisors"} src={"./logo.svg"} />
    </Box>
  );
}
