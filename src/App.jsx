import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./pages/Authentication";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navbar />}>
        <Route path="signup" element={<Authentication type="sign-up" />} />
        <Route path="login" element={<Authentication type="login" />} />
      </Route>
    </Routes>
  );
};

export default App;
