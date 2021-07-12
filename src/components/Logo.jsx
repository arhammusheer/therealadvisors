import { Avatar, Box } from "@chakra-ui/react";

export default function Logo() {
  return (
    <Box>
      <Avatar
        boxShadow={"lg"}
        bg={"black"}
        size={"md"}
        name={"The Real Advisors"}
        src={"./logo.svg"}
      />
    </Box>
  );
}
