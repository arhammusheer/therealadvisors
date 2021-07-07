import { Avatar, Box } from "@chakra-ui/react";

export default function Logo() {
  return (
    <Box>
      <Avatar
        bg={"transparent"}
        name={"The Real Advisors"}
        src={"./logo-500.png"}
      />
    </Box>
  );
}
