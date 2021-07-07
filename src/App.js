import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Error from "./components/Error";
import Switcher from "./components/Switcher";

function App() {
  return (
    <ChakraProvider>
      <Switcher />
      <Router>
        <AnimatePresence>
          <Switch>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="*">
              <Error error={{message: "Page Not Found", code:404}} />
            </Route>
          </Switch>
        </AnimatePresence>
      </Router>
    </ChakraProvider>
  );
}

export default App;
