import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";

export default function Switcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Box position={"fixed"} height={"8vh"}>
      <Flex justifyContent={"end"} align={"center"} p={3}>
        <Spacer />
        <IconButton
          icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          borderRadius={"full"}
        />
      </Flex>
    </Box>
  );
}
