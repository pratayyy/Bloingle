import { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { lookInSession } from "./common/Session";
import Authentication from "./pages/Authentication";
import Editor from "./pages/Editor";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";

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
        <Route path="/editor" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Homepage />} />
          <Route path="signup" element={<Authentication type="sign-up" />} />
          <Route path="login" element={<Authentication type="login" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
