import React from "react";
import { Link } from "react-router-dom";
import UserListButtons from "./UserListButtons";
import {
  Avatar,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
} from "@windmill/react-ui";

const UsersListItem = (displayedUsers) => {
  const users = displayedUsers?.users;

  return (
    <>
      {displayedUsers?.loginUserAuth?.isAdmin ? (
        <TableContainer className="mb-8 overflow-scroll md:overflow-auto lg:overflow-auto">
          <Table>
            <thead className="text-xs font-semibold tracking-wide text-left uppercase border-b border-gray-700 text-gray-400 bg-gray-800">
              <tr>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Number of followers</TableCell>
                <TableCell>Number of posts</TableCell>
                <TableCell className={"hidden sm:block"}>Actions</TableCell>
              </tr>
            </thead>
            <TableBody>
              {users?.map((user, i) => (
                <TableRow key={i} className="border-b">
                  <TableCell>
                    <Link to={`/profile/${user?._id}`}>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="mr-3"
                          src={user?.profilePicture}
                          alt="User profile picture"
                        />
                        <div>
                          <p className="font-semibold">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {user?.followers?.length} followers
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.posts?.length} Posts</span>
                  </TableCell>
                  <TableCell className={"hidden sm:block"}>
                    <UserListButtons user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={displayedUsers?.allUsers?.length}
              resultsPerPage={displayedUsers?.resultsPerPage}
              onChange={displayedUsers?.onPageChangeParent}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <TableContainer className="mb-8 overflow-scroll md:overflow-auto lg:overflow-auto">
          <Table>
            <thead className="text-xs font-semibold tracking-wide text-left uppercase border-b border-gray-700 text-gray-400 bg-gray-800">
              <tr>
                <TableCell>User</TableCell>
                <TableCell>Number of followers</TableCell>
                <TableCell>Number of posts</TableCell>
                <TableCell className={"hidden sm:block"}>Actions</TableCell>
              </tr>
            </thead>
            <TableBody>
              {users?.map((user, i) => (
                <TableRow key={i} className="border-b">
                  <TableCell>
                    <Link to={`/profile/${user?._id}`}>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="mr-3"
                          src={user?.profilePicture}
                          alt="User profile picture"
                        />
                        <div>
                          <p className="font-semibold">
                            {user?.firstName} {user?.lastName}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {user?.followers?.length} followers
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user?.posts?.length} Posts</span>
                  </TableCell>
                  <TableCell className={"hidden sm:block"}>
                    <UserListButtons user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter>
            <Pagination
              totalResults={displayedUsers?.allUsers?.length}
              resultsPerPage={displayedUsers?.resultsPerPage}
              onChange={displayedUsers?.onPageChangeParent}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      )}
    </>
  );
};

export default UsersListItem;
