import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import useLogout from "../utils/useLogout";
import ProfilePic from "/profile.png";
import { useNavigate } from "react-router-dom";
import Plus from "/plus-black.png";
import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, PlusCircle } from "lucide-react"; // Import icons

const Navbar = ({ search, onSearch, post }) => {
  Navbar.propTypes = {
    search: PropTypes.bool,
    onSearch: PropTypes.func,
    post: PropTypes.bool,
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const [inputText, setInputText] = useState("");

  const { loggedinUser, userInfo, updateLoggedinUser } = useContext(UserContext);
  const logout = useLogout();
  const navigate = useNavigate();

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    onSearch(e.target.value);
  };

  const handleLogout = () => {
    logout();
    updateLoggedinUser();
  };

  // Check if user is admin
  const isAdmin = userInfo?.isAdmin === true;

  return (
    <div className="sm:h-[10vh] w-[calc(100vw-8px)] fixed top-0 flex justify-between items-center text-[15px] sm:text-[1.2rem] bg-background border-b-[1px] border-primary-dark px-4 sm:px-10 font-medium z-10">
      <Link
        to="/"
        className="hover:text-primary-text font-mont text-2xl font-bold text-[#00376f]"
      >
        Gathr.
      </Link>
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Create Post button (for admin) */}
        {post && isAdmin && (
          <button
            className="hidden sm:inline-flex items-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
            onClick={() => {
              if (loggedinUser !== "") {
                navigate("/new");
              } else {
                navigate("/login");
              }
            }}
            title="Create Post"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            <span>Post</span>
          </button>
        )}

        {/* Create Event button (for admin) */}
        {isAdmin && (
          <button
            className="hidden sm:inline-flex items-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
            onClick={() => {
              if (loggedinUser !== "") {
                navigate("/create");
              } else {
                navigate("/login");
              }
            }}
            title="Create Event"
          >
            <Calendar className="h-5 w-5 mr-1" />
            <span>Event</span>
          </button>
        )}


        {/* Search box */}
        {search && (
          <div className="hidden sm:flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Search"
              value={inputText}
              onChange={handleTextChange}
            />
            <Button type="submit" className="bg-[#00376f] hover:bg-[#00376f]/95">
              Search
            </Button>
          </div>
        )}

        {/* User menu or login button */}
        {loggedinUser !== "" ? (
          <Menu as="div" className="relative ml-1">
            <div>
              <MenuButton className="flex rounded-full bg-gray-800 text-sm my-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="sr-only">Open user menu</span>
                {userInfo?.avatarUrl ? (
                  <img
                    className="h-12 w-12 rounded-full"
                    src={userInfo.avatarUrl}
                    alt=""
                    loading="lazy"
                  />
                ) : userInfo?.avatar ? (
                  <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <img
                      className="h-fit w-full rounded-full"
                      src={`https://amustud.pockethost.io/api/files/${userInfo.collectionId}/${userInfo.id}/${userInfo.avatar}`}
                      alt=""
                      loading="lazy"
                    ></img>
                  </span>
                ) : (
                  <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
              </MenuButton>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <MenuItem>
                  {({ focus }) => (
                    <Link
                      to="/profile"
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Your Profile
                    </Link>
                  )}
                </MenuItem>
                {/* <MenuItem>
                  {({ focus }) => (
                    <Link
                      to="#"
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700"
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </MenuItem> */}
                {/* Admin-specific menu items */}
                {isAdmin && (
                  <>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/new"
                          className={classNames(
                            focus ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Create Post
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to="/create"
                          className={classNames(
                            focus ? "bg-gray-100" : "",
                            "block px-4 py-2 text-sm text-gray-700"
                          )}
                        >
                          Create Event
                        </Link>
                      )}
                    </MenuItem>
                  </>
                )}
                <MenuItem>
                  {({ focus }) => (
                    <span
                      className={classNames(
                        focus ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                      )}
                      onClick={handleLogout}
                    >
                      Sign out
                    </span>
                  )}
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        ) : (
          <Link
            to={"/login"}
            className="rounded-lg border border-transparent my-1 sm:my-0 px-4 py-2 sm:text-base font-medium bg-background-light cursor-pointer transition-colors duration-200 hover:border-[#646cff] focus:outline focus:outline-[4px] focus:outline-auto focus:outline-webkit-focus-ring-color text-primary-text hover:text-primary-text/90"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;