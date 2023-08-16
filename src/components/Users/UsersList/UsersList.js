import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UsersListItem from "./UsersListItem";
import { fetchAllUsersAction } from "../../../redux/slices/users/userSlices";
import Toggle from "react-toggle"; // Import the correct toggle component from the library
import "react-toggle/style.css";

const UsersList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterFollowedAuthors, setFilterFollowedAuthors] = useState(false);
  const [pageTable1, setPageTable1] = useState(1);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const resultsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleToggleChange = (event) => {
    setFilterFollowedAuthors(event.target.checked);
  };

  const onPageChangeTable1 = (p) => {
    setPageTable1(p);
  };

  const users = useSelector((state) => state.users);
  const {
    appError,
    serverError,
    // loading,
    allUsers,
    loginUserAuth,
    blockedUser,
    unblockedUser,
    unfollowedUser,
    followedUser,
    deleteUser,
  } = users;

  useEffect(() => {
    dispatch(fetchAllUsersAction());
  }, [
    dispatch,
    blockedUser,
    unblockedUser,
    unfollowedUser,
    followedUser,
    deleteUser,
  ]);

  useEffect(() => {
    let filteredUsersFollow;
    if (filterFollowedAuthors) {
      const loginUser = allUsers?.find(
        (user) => user?.id === loginUserAuth?.id
      );
      filteredUsersFollow = loginUser?.following?.filter(
        (user) => user?.id !== loginUserAuth?.id
      );
    } else {
      filteredUsersFollow = allUsers?.filter(
        (user) => user?.id !== loginUserAuth?.id
      );
    }

    setFilteredUsers(
      filteredUsersFollow
        ?.filter(
          (user) =>
            user?.firstName
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user?.firstName + " " + user?.lastName)
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          const lastNameComparison = a.lastName.localeCompare(b.lastName);
          if (lastNameComparison !== 0) {
            return lastNameComparison;
          }
          return a.firstName.localeCompare(b.firstName);
        })
    );
  }, [allUsers, searchQuery, filterFollowedAuthors, loginUserAuth?.id]);

  useEffect(() => {
    if (filteredUsers) {
      const startIndex = (pageTable1 - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;

      const slicedUsers = filteredUsers.slice(startIndex, endIndex);
      setDisplayedUsers(slicedUsers);
    }
  }, [filteredUsers, pageTable1]);

  return (
    <div className={"bg-sky-950 min-h-screen"}>
      <article className="max-w-7xl px-6 py-12 mx-auto space-y-12 bg-sky-950 text-gray-50">
        <div className="w-full mx-auto space-y-4 text-center">
          <h1 className="text-4xl font-bold leadi md:text-5xl">Users List</h1>
          <p className="text-sm text-gray-400">Here are all the users.</p>
        </div>
        <div className="text-gray-100 grid">
          <label
            className="block text-white text-sm font-bold"
            htmlFor="search"
          >
            Search authors
          </label>
          <fieldset className="w-full space-y-1 text-gray-100 my-3">
            <label htmlFor="Search" className="hidden">
              Search
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <button
                  type="button"
                  title="search"
                  className="p-1 focus:outline-none focus:ring"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    className="w-4 h-4 text-gray-500"
                  >
                    <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                  </svg>
                </button>
              </span>
              <input
                type="search"
                name="Search"
                placeholder="Search authors..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="py-2 pl-10 text-sm w-full sm:w-auto rounded-md focus:outline-none white text-gray-500 focus:bg-gray-200 focus:border-violet-400"
              />
            </div>
          </fieldset>
          <label className="flex items-center">
            <Toggle
              id="biscuit-status"
              defaultChecked={filterFollowedAuthors}
              aria-labelledby="biscuit-label"
              onChange={handleToggleChange}
              className="mr-2"
            />
            <span id="biscuit-label" className="text-white">
              Show only users that you follow
            </span>
          </label>
        </div>
        <div className="pt-12 border-t border-gray-200">
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex flex-col">
              {/*{loading &&*/}
              {/*!blockedUser &&*/}
              {/*!unblockedUser &&*/}
              {/*!unfollowedUser &&*/}
              {/*!followedUser ? (*/}
              {/*  <LoadingComponent />*/}
              {/*) : */}
              {(appError || serverError) && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Error! </strong>
                  <span className="block sm:inline">
                    {serverError}! {appError}
                  </span>
                </div>
              )}
              <div>
                <UsersListItem
                  users={displayedUsers}
                  onPageChangeParent={onPageChangeTable1}
                  allUsers={filteredUsers}
                  resultsPerPage={resultsPerPage}
                  loginUserAuth={loginUserAuth}
                />
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default UsersList;
