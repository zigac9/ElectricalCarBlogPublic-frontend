import { Fragment, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { MenuIcon, XIcon, LightningBoltIcon } from "@heroicons/react/outline";
import { PlusIcon, LogoutIcon } from "@heroicons/react/solid";
import { useDispatch } from "react-redux";
import { logoutUserAction } from "../../../redux/slices/users/userSlices";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const PrivateNavbar = ({ isLogin }) => {
  const [isSet, setIsSet] = useState(true);
  const [navigation, setNavigation] = useState([
    { name: "Home", href: "/", current: false },
    { name: "Posts", href: "/posts", current: false },
    { name: "Authors", href: "/authors", current: false },
    { name: "Categories", href: "/category-list", current: false },
  ]);

  const [userNavigation, setUserNavigation] = useState([
    { name: "Your Profile", href: `/profile/${isLogin?.id}`, current: false },
    {
      name: "Update profile",
      href: `/update-profile/${isLogin?.id}`,
      current: false,
    },
    { name: "Change your password", href: "/update-password", current: false },
  ]);

  const handleNavigationClick = (index) => {
    if (isSet) {
      setUserNavigation(
        userNavigation?.map((item) => ({ ...item, current: false }))
      );
      setIsSet(false);
    }
    const updatedNavigation = navigation?.map((item, i) => {
      return {
        ...item,
        current: i === index,
      };
    });
    setNavigation(updatedNavigation);
  };

  const handleUserNavigationClick = (index) => {
    if (!isSet) {
      setNavigation(navigation?.map((item) => ({ ...item, current: false })));
      setIsSet(true);
    }
    const updatedUserNavigation = userNavigation?.map((item, i) => {
      return {
        ...item,
        current: i === index,
      };
    });
    setUserNavigation(updatedUserNavigation);
  };

  const handleAllFalse = () => {
    setNavigation(navigation?.map((item) => ({ ...item, current: false })));
    setUserNavigation(
      userNavigation?.map((item) => ({ ...item, current: false }))
    );
    setIsSet(true);
  };

  const dispatch = useDispatch();

  return (
    <Disclosure as="nav" className="bg-gray-900">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  {/* Logo */}
                  <LightningBoltIcon className="h-10 w-10 text-yellow-200" />
                </div>
                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation?.map((item, index) => (
                    <Link
                      onClick={() => handleNavigationClick(index)}
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 ">
                  <Link
                    to="/create-post"
                    onClick={() => handleAllFalse()}
                    className="pr-3  relative inline-flex items-center mr-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-indigo-500"
                  >
                    <PlusIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>New Post</span>
                  </Link>

                  <button
                    onClick={() => dispatch(logoutUserAction())}
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-indigo-500"
                  >
                    <LogoutIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>Logout</span>
                  </button>
                </div>
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                  {/* Profile dropdown */}
                  <Menu as="div" className="ml-3 relative">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-gray-700 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                              draggable={false}
                              className="h-8 w-8 rounded-full"
                              src={isLogin?.profilePicture}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                          >
                            {userNavigation?.map((item, index) => (
                              <Menu.Item key={item.name}>
                                {() => (
                                  <Link
                                    onClick={() =>
                                      handleUserNavigationClick(index)
                                    }
                                    to={item.href}
                                    className={classNames(
                                      item.current ? "bg-gray-300" : "",
                                      "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation?.map((item, index) => (
                <Link
                  onClick={() => handleNavigationClick(index)}
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            {/* Mobile */}
            <div className="pt-4 pb-3 border-t border-gray-700">
              <div className="flex items-center px-5 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    draggable={false}
                    className="h-10 w-10 rounded-full"
                    src={isLogin?.profilePicture}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {isLogin?.firstName} {isLogin?.lastName}
                  </div>
                  <div className="text-sm font-medium text-gray-400">
                    {isLogin.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1 sm:px-3">
                {userNavigation?.map((item, index) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleUserNavigationClick(index)}
                    className={classNames(
                      item.current
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default PrivateNavbar;
