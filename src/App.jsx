import { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Authentication from "./pages/Authentication";
import { lookInSession } from "./common/Session";

export const UserContext = createContext({});

const App = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const userInSession = lookInSession("user");
    userInSession
      ? setUser(JSON.parse(userInSession))
      : setUser({ token: null });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route path="signup" element={<Authentication type="sign-up" />} />
          <Route path="login" element={<Authentication type="login" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
