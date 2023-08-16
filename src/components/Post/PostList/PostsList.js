import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EyeIcon, ThumbDownIcon, ThumbUpIcon } from "@heroicons/react/solid";
import {
  fetchAllPostsAction,
  addLikeAction,
  addDislikeAction,
} from "../../../redux/slices/posts/postSlices";
import { DateFormatter } from "../../../utils/DateFormatter";
import { fetchAllCategoriesAction } from "../../../redux/slices/category/categorySlices";
import { fetchUserDetailsAction } from "../../../redux/slices/users/userSlices";
import Toggle from "react-toggle";
import CategoriesPostListDropDown from "../../Categories/CategoryDropDown/CategoriesPostListDropDown";
import { useFormik } from "formik";
import UsersDropdown from "../../Users/UsersDropdown/UsersDropdown";
import { Pagination } from "@windmill/react-ui";

const PostsList = () => {
  const dispatch = useDispatch();

  //formik
  const formik = useFormik({
    initialValues: {
      mainCategory: undefined,
      userId: undefined,
    },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOptionCategory, setFilterOptionCategory] = useState(undefined);
  const [filterOptionUsers, setFilterOptionUsers] = useState(undefined);
  const [filterFollowedAuthors, setFilterFollowedAuthors] = useState(false);
  const [filteredPostsFollow, setFilteredPostsFollow] = useState([]);
  const [firstPostsFollow, setFirstPostsFollow] = useState([]);
  const [otherPostsFollow, setOtherPostsFollow] = useState([]);
  const [filterPosts, setFilterPosts] = useState([]);
  const [pageTable1, setPageTable1] = useState(1);
  const resultsPerPage = 7;

  const handleToggleChange = (event) => {
    setFilterFollowedAuthors(event.target.checked);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const onPageChangeTable1 = (p) => {
    setPageTable1(p);
  };

  const user = useSelector((state) => state?.users);
  const { loginUserAuth } = user;

  const post = useSelector((state) => state?.post);
  const { appErrPost, serverErrPost, fetchAllPosts, addLike, addDislike } =
    post;

  useEffect(() => {
    dispatch(fetchAllPostsAction());
  }, [dispatch, addLike, addDislike]);

  useEffect(() => {
    dispatch(fetchAllCategoriesAction());
  }, [dispatch]);

  useEffect(() => {
    if (loginUserAuth) {
      dispatch(fetchUserDetailsAction(loginUserAuth?.id));
    }
  }, [dispatch, loginUserAuth]);

  const { userDetails } = useSelector((state) => state?.users);

  useEffect(() => {
    setFilterOptionCategory(formik?.values?.mainCategory);
  }, [formik?.values?.mainCategory]);

  useEffect(() => {
    setFilterOptionUsers(formik?.values?.userId);
  }, [formik?.values?.userId]);

  useEffect(() => {
    if (filterFollowedAuthors) {
      setFilteredPostsFollow(
        fetchAllPosts?.filter((post) => {
          const isFollowing = userDetails?.following?.includes(post?.user?.id);
          const isNotLoggedInUser = post?.user?.id !== loginUserAuth?.id;
          const isPublic = post?.isPublic === true;
          const isAdmin = loginUserAuth?.isAdmin === true;

          return isFollowing && isNotLoggedInUser && (isPublic || isAdmin);
        })
      );
    } else {
      setFilteredPostsFollow(
        fetchAllPosts?.filter(
          (post) =>
            post?.user?.id !== loginUserAuth?.id &&
            (post?.isPublic === true || loginUserAuth?.isAdmin === true)
        )
      );
    }
  }, [
    fetchAllPosts,
    filterFollowedAuthors,
    loginUserAuth?.id,
    loginUserAuth?.isAdmin,
    userDetails?.following,
  ]);

  useEffect(() => {
    const filteredPosts = filteredPostsFollow
      ?.filter((post) => {
        const matchesCategory =
          filterOptionCategory === undefined ||
          filterOptionCategory.length === 0 ||
          filterOptionCategory.find((cat) => cat?.label === post?.mainCategory);

        const matchesUser =
          filterOptionUsers === undefined ||
          filterOptionUsers.length === 0 ||
          filterOptionUsers.find((user) => user?.value === post?.user?._id);

        const matchesSearchQuery = post?.title
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesUser && matchesSearchQuery;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilterPosts(filteredPosts);
    setFirstPostsFollow(filteredPosts?.[0]);
    setOtherPostsFollow(filteredPosts?.slice(1));
  }, [
    filterOptionCategory,
    filterOptionUsers,
    filteredPostsFollow,
    searchQuery,
  ]);

  useEffect(() => {
    if (filterPosts) {
      const startIndex = (pageTable1 - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;

      const slicedUsers = filterPosts.slice(startIndex, endIndex);
      setFirstPostsFollow(slicedUsers?.[0]);
      setOtherPostsFollow(slicedUsers?.slice(1));
    }
  }, [filterPosts, pageTable1]);

  return (
    <div className={"bg-sky-950 min-h-screen"}>
      <article className="max-w-7xl px-6 py-12 mx-auto space-y-12 bg-sky-950 text-gray-50 min-h-screen">
        <div className="w-full mx-auto space-y-4 text-center">
          <h1 className="text-4xl font-bold leadi md:text-5xl">Blog</h1>
          <p className="text-sm text-gray-400">Here are all the blog posts.</p>
        </div>
        <div className="text-gray-100 flex flex-col sm:flex-row">
          {/* search by post title */}
          <div className="w-full lg:w-1/2 m-2">
            <div className="flex items-center">
              <div className="w-full">
                <div className="relative">
                  <fieldset className="w-full space-y-1 text-gray-100">
                    <label htmlFor="search" className="text-white">
                      Filter by post title
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
                        id="search"
                        placeholder="Search by post title..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="py-2 pl-10 w-full text-white bg-gray-800 focus:outline-none focus:shadow-outline focus:placeholder:text-gray-200 border border-gray-500 rounded px-4 block appearance-none leading-normal placeholder:text-gray-300"
                      />
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
          </div>

          {/* Filter by category with react Select */}
          <div className="w-full lg:w-1/2 m-2">
            <div className="flex items-center">
              <div className="w-full">
                <div className="relative">
                  <label htmlFor="search" className="text-white">
                    Filter by category
                  </label>
                  <CategoriesPostListDropDown
                    isMulti={true}
                    bgColor={"#1f2937"}
                    value={formik.values.mainCategory?.label}
                    onChange={formik.setFieldValue}
                    onBlur={formik.setFieldTouched}
                    error={formik.errors.mainCategory}
                    touched={formik.touched.mainCategory}
                    className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 m-2">
            <div className="flex items-center">
              <div className="w-full">
                <div className="relative">
                  <label htmlFor="search" className="text-white">
                    Filter by user
                  </label>
                  <UsersDropdown
                    isMulti={true}
                    value={formik.values.userId?.label}
                    onChange={formik.setFieldValue}
                    onBlur={formik.setFieldTouched}
                    error={formik.errors.userId}
                    touched={formik.touched.userId}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* toggle */}
          {loginUserAuth && (
            <div className="w-full lg:w-1/2 m-2 flex items-center">
              <div className="w-full">
                <div className="flex flex-col">
                  <label htmlFor="toggle" className="text-white">
                    Filter by followed authors:
                  </label>
                  <div>
                    <Toggle
                      id="biscuit-status"
                      defaultChecked={filterFollowedAuthors}
                      aria-labelledby="biscuit-label"
                      onChange={handleToggleChange}
                      className={"mt-2"}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-gray-200" />
        {appErrPost || serverErrPost ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">
              {serverErrPost}! {appErrPost}
            </span>
          </div>
        ) : firstPostsFollow?.length <= 0 || firstPostsFollow === undefined ? (
          <div
            className="bg-gray-800 border border-sky-800 text-gray-300 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">No posts found! </strong>
            <span className="block sm:inline">
              Please try again with different filter options.
            </span>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex flex-col">
              <section className="bg-sky-950 text-gray-100">
                <div className="container  mx-auto space-y-6 sm:space-y-12">
                  <div
                    rel="noopener noreferrer"
                    className="block  gap-3 mx-auto  group hover:no-underline focus:no-underline lg:grid lg:grid-cols-12 bg-gray-900 rounded"
                  >
                    <img
                      draggable={false}
                      src={firstPostsFollow?.image}
                      alt={firstPostsFollow?.title}
                      className="object-cover w-full h-64 rounded sm:h-96 lg:col-span-7 bg-gray-500"
                    />
                    <div className="space-y-2 lg:col-span-5">
                      <div className="flex flex-col p-6 col-span-full row-span-full lg:col-span-8 lg:p-7">
                        <div className="flex justify-start">
                          <span className="px-2 py-1 text-xs rounded-full bg-violet-400 text-gray-900">
                            {firstPostsFollow?.mainCategory}
                          </span>
                        </div>
                        <h1 className="text-3xl font-semibold break-words mt-2">
                          {firstPostsFollow?.title}
                        </h1>
                        <span className="text-xs text-gray-400 mt-2">
                          <DateFormatter dateString={firstPostsFollow?.date} />
                        </span>

                        <p className="flex-1 pt-2 mb-5 break-words">
                          {firstPostsFollow?.description?.length > 200
                            ? firstPostsFollow?.description?.substring(0, 200) +
                              "..."
                            : firstPostsFollow?.description}
                        </p>
                        {loginUserAuth ? (
                          <div className="flex items-center mt-4">
                            <div className="flex items-center mr-4">
                              <button
                                onClick={() => {
                                  dispatch(
                                    addLikeAction(firstPostsFollow?._id)
                                  );
                                }}
                              >
                                <ThumbUpIcon
                                  className={`w-6 h-6 mr-1 ${
                                    firstPostsFollow?.likes?.length > 0
                                      ? "text-green-400 hover:text-green-600"
                                      : "text-gray-400 hover:text-green-600"
                                  }`}
                                />
                              </button>
                              <span className="text-gray-400 text-sm">
                                {firstPostsFollow?.likes?.length}
                              </span>
                            </div>
                            <div className="flex items-center mr-4">
                              <button
                                onClick={() => {
                                  dispatch(
                                    addDislikeAction(firstPostsFollow?._id)
                                  );
                                }}
                              >
                                <ThumbDownIcon
                                  className={`w-6 h-6 mr-1 ${
                                    firstPostsFollow?.disLikes?.length > 0
                                      ? "text-red-400 hover:text-red-600"
                                      : "text-gray-400 hover:text-red-600"
                                  }`}
                                />
                              </button>
                              <span className="text-gray-400 text-sm">
                                {firstPostsFollow?.disLikes?.length}
                              </span>
                            </div>
                            <div className="flex items-center mr-4">
                              <EyeIcon
                                className={`w-6 h-6 mr-1 text-gray-400`}
                              />
                              <span className="text-gray-400 text-sm">
                                {firstPostsFollow?.numViews}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center mt-4">
                            <div className="flex items-center mr-4">
                              <ThumbUpIcon
                                className={`w-6 h-6 mr-1 ${
                                  firstPostsFollow?.likes?.length > 0
                                    ? "text-green-400"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="text-gray-400 text-sm">
                                {firstPostsFollow?.likes?.length}
                              </span>
                            </div>
                            <div className="flex items-center mr-4">
                              <ThumbDownIcon
                                className={`w-6 h-6 mr-1 ${
                                  firstPostsFollow?.disLikes?.length > 0
                                    ? "text-red-400"
                                    : "text-gray-400"
                                }`}
                              />
                              <span className="text-gray-400 text-sm">
                                {firstPostsFollow?.disLikes?.length}
                              </span>
                            </div>
                            <div className="flex items-center mr-4">
                              <EyeIcon
                                className={`w-6 h-6 mr-1 text-gray-400`}
                              />
                              <span className="text-gray-400 text-sm">
                                {firstPostsFollow?.numViews}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex space-x-2">
                            <Link
                              rel="noopener noreferrer"
                              to={`/profile/${firstPostsFollow?.user?._id}`}
                              className="flex items-center hover:opacity-70"
                            >
                              <img
                                draggable={false}
                                src={firstPostsFollow?.user?.profilePicture}
                                alt={firstPostsFollow?.user?.email}
                                className="object-cover w-10 h-10 mt-2 mr-2 rounded-full bg-gray-500"
                              />
                              <span className="text-gray-400">
                                {firstPostsFollow?.user?.firstName}{" "}
                                {firstPostsFollow?.user?.lastName}
                              </span>
                            </Link>
                          </div>
                          {/*<MailIcon className={`w-5 h-5 mr-1 text-gray-400`} />*/}
                          <Link
                            rel="noopener noreferrer"
                            to={`/posts/${firstPostsFollow?._id}`}
                            className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            <span>Read more</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  {otherPostsFollow?.length > 0 && (
                    <div className="grid justify-center grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {otherPostsFollow?.map((post) => (
                        <div
                          rel="noopener noreferrer"
                          className="lg:max-w-[25rem] sm:max-w-full mx-auto group hover:no-underline focus:no-underline bg-gray-900"
                          key={post?._id}
                        >
                          <img
                            draggable={false}
                            src={post?.image}
                            alt={post?.title}
                            className="object-cover w-full h-75 rounded sm:h-96 lg:col-span-7 bg-gray-500"
                            style={{ width: "600px", height: "200px" }}
                          />
                          <div className="space-y-2 lg:col-span-5">
                            <div className="flex flex-col p-6 col-span-full row-span-full lg:col-span-8 lg:p-7">
                              <div className="flex justify-start">
                                <span className="px-2 py-1 text-xs rounded-full bg-violet-400 text-gray-900">
                                  {post?.mainCategory}
                                </span>
                              </div>
                              <h1 className="text-3xl font-semibold break-words mt-2">
                                {post?.title}
                              </h1>
                              <span className="text-xs text-gray-400 mt-2">
                                <DateFormatter dateString={post?.date} />
                              </span>

                              <p className="flex-1 pt-2 mb-5 break-words">
                                {post?.description?.length >= 100
                                  ? post?.description?.substring(0, 99) + "..."
                                  : post?.description}
                              </p>
                              {loginUserAuth ? (
                                <div className="flex items-center mt-4">
                                  <div className="flex items-center mr-4">
                                    <button
                                      onClick={() => {
                                        dispatch(addLikeAction(post?._id));
                                      }}
                                    >
                                      <ThumbUpIcon
                                        className={`w-6 h-6 mr-1 ${
                                          post?.likes?.length > 0 &&
                                          post?.likes?.filter((like) => {
                                            return (
                                              like?.id === loginUserAuth?.id
                                            );
                                          }).length > 0
                                            ? "text-green-400 hover:text-green-600"
                                            : "text-gray-400 hover:text-green-600"
                                        }`}
                                      />
                                    </button>
                                    <span className="text-gray-400 text-sm">
                                      {post?.likes?.length}
                                    </span>
                                  </div>
                                  <div className="flex items-center mr-4">
                                    <button
                                      onClick={() => {
                                        dispatch(addDislikeAction(post?._id));
                                      }}
                                    >
                                      <ThumbDownIcon
                                        className={`w-6 h-6 mr-1 ${
                                          post?.disLikes?.length > 0 &&
                                          post?.disLikes?.filter((dislike) => {
                                            return (
                                              dislike?.id === loginUserAuth?.id
                                            );
                                          }).length > 0
                                            ? "text-red-400 hover:text-red-600"
                                            : "text-gray-400 hover:text-red-600"
                                        }`}
                                      />
                                    </button>
                                    <span className="text-gray-400 text-sm">
                                      {post?.disLikes?.length}
                                    </span>
                                  </div>
                                  <div className="flex items-center mr-4">
                                    <EyeIcon
                                      className={`w-6 h-6 mr-1 text-gray-400`}
                                    />
                                    <span className="text-gray-400 text-sm">
                                      {post?.numViews}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center mt-4">
                                  <div className="flex items-center mr-4">
                                    <ThumbUpIcon
                                      className={`w-6 h-6 mr-1 ${
                                        post?.likes?.length > 0 &&
                                        post?.likes?.filter((like) => {
                                          return like?.id === loginUserAuth?.id;
                                        }).length > 0
                                          ? "text-green-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span className="text-gray-400 text-sm">
                                      {post?.likes?.length}
                                    </span>
                                  </div>
                                  <div className="flex items-center mr-4">
                                    <ThumbDownIcon
                                      className={`w-6 h-6 mr-1 ${
                                        post?.disLikes?.length > 0 &&
                                        post?.disLikes?.filter((dislike) => {
                                          return (
                                            dislike?.id === loginUserAuth?.id
                                          );
                                        }).length > 0
                                          ? "text-red-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                    <span className="text-gray-400 text-sm">
                                      {post?.disLikes?.length}
                                    </span>
                                  </div>
                                  <div className="flex items-center mr-4">
                                    <EyeIcon
                                      className={`w-6 h-6 mr-1 text-gray-400`}
                                    />
                                    <span className="text-gray-400 text-sm">
                                      {post?.numViews}
                                    </span>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center justify-between pt-2">
                                <div className="flex space-x-2">
                                  <Link
                                    rel="noopener noreferrer"
                                    to={`/profile/${post?.user?._id}`}
                                    className="flex items-center hover:opacity-70"
                                  >
                                    <img
                                      draggable={false}
                                      src={post?.user?.profilePicture}
                                      alt={post?.user?.email}
                                      className="object-cover w-10 h-10 mt-2 mr-2 rounded-full bg-gray-500"
                                    />
                                    <span className="text-gray-400">
                                      {post?.user?.firstName}{" "}
                                      {post?.user?.lastName}
                                    </span>
                                  </Link>
                                </div>
                                {/*<MailIcon className={`w-5 h-5 mr-1 text-gray-400`} />*/}
                                <Link
                                  rel="noopener noreferrer"
                                  to={`/posts/${post?._id}`}
                                  className="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                  <span>Read more</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="w-4 h-4"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="p-5 bg-gray-900 text-gray-400 rounded-md">
                    <Pagination
                      totalResults={filterPosts?.length}
                      resultsPerPage={resultsPerPage}
                      onChange={onPageChangeTable1}
                      label="Table navigation"
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostsList;
