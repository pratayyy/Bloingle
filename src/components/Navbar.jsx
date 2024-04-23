import { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import logo from "../images/blongle-icon.png";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavigationPanel, setUserNavigationPanel] = useState(false);

  const navigate = useNavigate();

  const {
    user,
    user: { token, data },
  } = useContext(UserContext);

  const handleSearch = (e) => {
    const query = e.target.value;

    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
      e.target.value = null;
    }
  };

  return (
    <>
      <nav className="navbar z-50">
        <Link to="/" className="flex-none w-10">
          <img src={logo} className="w-full" />
        </Link>

        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />

          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() =>
              setSearchBoxVisibility((currentValue) => !currentValue)
            }
          >
            <i className="fi fi-rr-search text-xl mt-1"></i>
          </button>

          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {token ? (
            <>
              <Link to="/dashboard/notification">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2l block mt-1"></i>
                </button>
              </Link>

              <div
                className="relative"
                onClick={() =>
                  setUserNavigationPanel((currentValue) => !currentValue)
                }
                onBlur={() =>
                  setTimeout(() => {
                    setUserNavigationPanel(false);
                  }, 200)
                }
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={data.photo}
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>

                {userNavigationPanel ? <UserNavigationPanel /> : ""}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-dark py-2">
                Login
              </Link>

              <Link to="/signup" className="btn-light py-2 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
