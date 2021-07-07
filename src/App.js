import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Switcher from "./components/Switcher";

function App() {
  return (
    <ChakraProvider>
      <Switcher />
      <Router>
        <AnimatePresence>
          <Switch>
            <Route path="/dashboard">
              <ProtectedDash />
            </Route>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </AnimatePresence>
      </Router>
    </ChakraProvider>
  );
}

const ProtectedDash = () => {
  return <Dashboard/>
 
};

export default App;
