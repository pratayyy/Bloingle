import { Outlet } from "react-router-dom";

const SideNavbar = () => {
  return (
    <>
      <h1>this is the side navbar</h1>

      <Outlet />
    </>
  );
};

export default SideNavbar;
