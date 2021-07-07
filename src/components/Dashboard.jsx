import { Box } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [Data, setData] = useState({});
  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => console.log(err));
  }, []);
	if(!Data.isInServer){
		return <Box>Sorry but you're not in the server</Box>
	}
  return JSON.stringify(Data);
}