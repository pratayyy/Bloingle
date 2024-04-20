import { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { lookInSession } from "./common/Session";
import Editor from "./pages/Editor";
import Navbar from "./components/Navbar";
import Authentication from "./pages/Authentication";
import Homepage from "./pages/Homepage";
import Search from "./pages/Search";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import Blog from "./pages/Blog";

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
        <Route path="/editor/:slug" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<Homepage />} />
          <Route path="signup" element={<Authentication type="sign-up" />} />
          <Route path="login" element={<Authentication type="login" />} />
          <Route path="search/:query" element={<Search />} />
          <Route path="user/:id" element={<Profile />} />
          <Route path="blog/:slug" element={<Blog />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
