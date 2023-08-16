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
import { Link } from "react-router-dom";
import { DateFormatter } from "../../../utils/DateFormatter";
import { PencilAltIcon } from "@heroicons/react/outline";
import { TrashIcon } from "@heroicons/react/solid";
import React from "react";

const CategoryListItem = (props) => {
  return (
    <>
      <TableContainer className="mb-8 overflow-scroll md:overflow-auto lg:overflow-auto">
        <Table>
          <thead className="text-xs font-semibold tracking-wide text-left uppercase border-b border-gray-700 text-gray-400 dark:text-gray-400 bg-gray-800 dark:bg-gray-800">
            <tr>
              <TableCell>User</TableCell>
              <TableCell>Category title</TableCell>
              <TableCell>Created at</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </thead>
          <TableBody>
            {props?.displayedCategory?.map((category, i) => (
              <TableRow key={i} className="border-b">
                <TableCell>
                  <Link to={`/profile/${category?.user?._id}`}>
                    <div className="flex items-center text-sm">
                      <Avatar
                        className="mr-3"
                        src={category?.user?.profilePicture}
                        alt="User profile picture"
                      />
                      <div>
                        <p className="font-semibold">
                          {category?.user?.firstName} {category?.user?.lastName}
                        </p>
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{category?.title}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {<DateFormatter date={category?.createdAt} />}
                  </span>
                </TableCell>
                <TableCell>
                  {(category?.user?.id === props?.loginUserAuth?.id ||
                    props?.loginUserAuth?.isAdmin) && (
                    <div className={"flex"}>
                      <Link to={`/update-category/${category?._id}`}>
                        <PencilAltIcon className="h-5 mt-3 text-indigo-500 hover:text-indigo-700" />
                      </Link>
                      <button
                        onClick={() => props?.toggleShow(category?._id)}
                        type="submit"
                        className="ml-3"
                      >
                        <TrashIcon className="h-5 mt-3 text-red-600 hover:text-red-800 cursor-pointer" />
                      </button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={props?.filteredCategory?.length}
            resultsPerPage={props?.resultsPerPage}
            onChange={props?.onPageChangeParent}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
};

export default CategoryListItem;
