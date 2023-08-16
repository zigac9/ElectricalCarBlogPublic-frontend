import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  HeartIcon,
  EmojiSadIcon,
  UploadIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { MailIcon, EyeIcon } from "@heroicons/react/solid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProfileAction,
  followUserAction,
  unfollowUserAction,
} from "../../../redux/slices/users/userSlices";
import { DateFormatter, DateTimeFormatter } from "../../../utils/DateFormatter";
import { Pagination } from "@windmill/react-ui";

const UserProfile = (props) => {
  const { id } = props.match.params;

  const dispatch = useDispatch();

  const history = useHistory();

  const resultsPerPage = 10;

  const [filteredPosts, setFilteredPosts] = useState([]);
  const [pageTable1, setPageTable1] = useState(1);
  const [isLoginUser, setIsLoginUser] = useState(false);
  const onPageChangeTable1 = (p) => {
    setPageTable1(p);
  };

  const followUser = useSelector((state) => state.users);
  const { followedUser, unfollowedUser } = followUser;

  useEffect(() => {
    dispatch(fetchUserProfileAction(id));
  }, [dispatch, id, followedUser, unfollowedUser]);

  const users = useSelector((state) => state.users);
  const {
    // profileLoading,
    profileAppError,
    profileServerError,
    userProfile,
    loginUserAuth,
  } = users;

  const sendMailNavigate = () => {
    history.push({
      pathname: `/send-email`,
      state: {
        email: userProfile?.email,
        userId: userProfile?.id,
        firstName: userProfile?.firstName,
        lastName: userProfile?.lastName,
      },
    });
  };

  useEffect(() => {
    if (loginUserAuth?.id === userProfile?._id) {
      setIsLoginUser(true);
    } else {
      setIsLoginUser(false);
    }
  }, [loginUserAuth?.id, userProfile?._id]);

  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => {
    if (!isLoginUser) {
      const followers = userProfile?.followers;
      const isFollower = followers?.find(
        (follower) => follower?.id === loginUserAuth?._id
      );
      setIsFollowed(!!isFollower);
    }
  }, [
    followedUser,
    unfollowedUser,
    isLoginUser,
    loginUserAuth?._id,
    userProfile,
  ]);

  useEffect(() => {
    if (userProfile?.posts) {
      const startIndex = (pageTable1 - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;

      let postsFilter = [...userProfile?.posts];
      if (loginUserAuth?.isAdmin === false && !isLoginUser) {
        postsFilter = postsFilter.filter((post) => post?.isPublic === true);
      }

      const postsSort = [...postsFilter]?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const slicedPosts = postsSort.slice(startIndex, endIndex);
      setFilteredPosts(slicedPosts);
    }
  }, [isLoginUser, loginUserAuth?.isAdmin, pageTable1, userProfile?.posts]);

  return (
    <>
      <div className={"justify-center items-center"}>
        {/*{profileLoading && !followedUser && !unfollowedUser ? (*/}
        {/*  <LoadingComponent />*/}
        {/*) :*/}
        {profileAppError || profileServerError ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">
              {profileServerError}! {profileAppError}
            </span>
          </div>
        ) : (
          <div className="flex bg-sky-950">
            {/* Static sidebar for desktop */}
            <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
              <div className="flex-1 relative z-0 flex overflow-hidden">
                <main className="flex-1 relative z-0 focus:outline-none xl:order-last">
                  {/* Profile header */}
                  <div className={"bg-white"}>
                    <div>
                      <img
                        draggable={false}
                        className="h-32 object-cover w-full lg:h-48"
                        src={userProfile?.coverPhoto}
                        alt={userProfile?.email}
                      />
                    </div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
                      <div className="-mt-12 sm:mt-5 md:-mt-12 lg:-mt-12 sm:flex sm:space-x-5">
                        <div className="flex -mt-2 lg:mt-20 md:mt-20">
                          <img
                            draggable={false}
                            className="h-24 w-24 rounded-full  ring-4 ring-white sm:h-32 sm:w-32"
                            src={userProfile?.profilePicture}
                            alt={userProfile?.email}
                          />
                        </div>
                        <div className="mt-0 md:mt-10 lg:mt-10 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                          <div className=" flex flex-col 2xl:block mt-10 min-w-0 flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 ">
                              {userProfile?.firstName} {userProfile?.lastName}
                              {/* Display if verified or not */}
                              {userProfile?.isAccountVerified ? (
                                <span className="inline-flex ml-2 items-center px-3 py-1  rounded-lg text-sm font-medium bg-green-600 text-gray-300">
                                  Account Verified
                                </span>
                              ) : (
                                <span className="inline-flex ml-2 items-center px-3 py-1  rounded-lg text-sm font-medium bg-red-600 text-gray-300">
                                  Unverified Account
                                </span>
                              )}
                              {userProfile?.isAdmin && (
                                <span className="inline-flex ml-0 md:ml-2 lg:ml-2 items-center px-3 py-1 rounded-lg text-sm font-medium bg-sky-900 text-gray-300">
                                  Administrator
                                </span>
                              )}
                            </h1>
                            <p className="mt-4 text-lg">
                              Date Joined:{" "}
                              <DateFormatter date={userProfile?.createdAt} />{" "}
                            </p>
                            <p className="text-gray-500 mt-4">
                              {userProfile?.followers.length} followers{" - "}
                              {userProfile?.following.length} following
                            </p>
                            {/* Who view my profile */}
                            <div className="flex items-center mt-4">
                              <EyeIcon className="h-5 w-5 " />
                              <div className="pl-2">
                                {userProfile?.viewedBy?.length}{" "}
                                {userProfile?.viewedBy?.length > 1
                                  ? "people"
                                  : "person"}{" "}
                                <span>viewed this profile</span>
                              </div>
                            </div>

                            {/* is login user */}
                            {/* Upload profile photo */}
                            <div
                              className={
                                "space-x-0 space-y-2 mt-4 lg:space-x-2 md:space-x-2 lg:space-y-0 md:space-y-0 w-full flex-row lg:inline-flex md:inline-flex"
                              }
                            >
                              {isLoginUser && (
                                <>
                                  <Link
                                    to={`/upload-profile-photo`}
                                    className="inline-flex justify-center w-48 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                  >
                                    <UploadIcon
                                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>Upload Profile Photo</span>
                                  </Link>
                                  <Link
                                    to={`/upload-cover-photo`}
                                    className="inline-flex justify-center w-48 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                  >
                                    <UploadIcon
                                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                      aria-hidden="true"
                                    />
                                    <span>Upload Cover Photo</span>
                                  </Link>
                                </>
                              )}
                              {!isLoginUser && (
                                <>
                                  {isFollowed ? (
                                    <button
                                      onClick={() =>
                                        dispatch(unfollowUserAction(id))
                                      }
                                      className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                    >
                                      <EmojiSadIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span>Unfollow</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() =>
                                        dispatch(followUserAction(id))
                                      }
                                      type="button"
                                      className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                    >
                                      <HeartIcon
                                        className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                        aria-hidden="true"
                                      />
                                      <span>Follow </span>
                                    </button>
                                  )}
                                </>
                              )}
                              {/* Send Mail */}
                              {!isLoginUser && (
                                <button
                                  onClick={sendMailNavigate}
                                  className="inline-flex justify-center w-48 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                  <MailIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span>Send Message</span>
                                </button>
                              )}
                              {loginUserAuth?.isAdmin && (
                                <Link
                                  to={`/update-profile/${userProfile?._id}`}
                                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                  <UserIcon
                                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span>Update User Profile</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="sm:block min-w-0 flex-1">
                        <h1 className="text-2xl font-bold text-white truncate">
                          {userProfile?.firstName} {userProfile?.lastName}
                        </h1>
                      </div>
                    </div>
                  </div>
                  {/* Tabs */}
                  <div className="mt-6 sm:mt-2 2xl:mt-5">
                    <div className="border-b-2 border-gray-500">
                      <div className="max-w-5xl mx-auto "></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap lg:flex-nowrap justify-center items-start min-h-screen mb-5">
                    {isLoginUser && loginUserAuth?.isAdmin && (
                      <div className="w-full lg:w-1/3 mx-4 px-4 mb-4 md:mb-0">
                        <h1 className="text-center text-2xl border-gray-500 mb-2 p-3 border-b-2 text-gray-300">
                          <span className={"font-bold"}>
                            Who viewed this profile :
                          </span>{" "}
                          {userProfile?.viewedBy?.length}
                        </h1>

                        {/* Who view my post */}
                        <ul className="">
                          {userProfile?.viewedBy?.length <= 0 ? (
                            <h1
                              className={"text-center text-yellow-600 text-xl"}
                            >
                              No one viewed this profile
                            </h1>
                          ) : (
                            userProfile?.viewedBy?.map((user) => (
                              <li
                                key={user?._id}
                                className="flex items-center mb-2 p-2 rounded bg-gray-900"
                              >
                                <img
                                  draggable={false}
                                  className="w-10 h-10 rounded-full mr-4"
                                  src={user?.profilePicture}
                                  alt={user?.email}
                                />
                                <div className="text-sm">
                                  <Link to={`/profile/${user?._id}`}>
                                    <p className="text-gray-400 leading-none">
                                      {user?.firstName} {user?.lastName}
                                    </p>
                                  </Link>
                                  <p className="text-gray-500">{user?.email}</p>
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    )}

                    {/* All my Post */}
                    <div className="w-full max-w-7xl mx-4 px-4 mb-4 md:mb-0">
                      <h1 className="text-center text-2xl border-gray-500 mb-2 p-3 border-b-2 text-gray-300">
                        <span className={"font-bold"}>
                          All published user posts -{" "}
                        </span>
                        {userProfile?.posts?.length}
                      </h1>
                      <div className={"space-y-3"}>
                        {userProfile?.posts?.length <= 0 ? (
                          <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                            role="alert"
                          >
                            <strong className="font-bold">
                              No posts found!{" "}
                            </strong>
                            <span className="block sm:inline">
                              User doesn't have any posts.
                            </span>
                          </div>
                        ) : (
                          filteredPosts?.map((post) => (
                            <div
                              className="bg-gray-900 text-gray-50 rounded"
                              key={post?.id}
                            >
                              <div className="container grid grid-cols-12 mx-auto bg-gray-900 rounded">
                                <div
                                  className="bg-no-repeat bg-cover bg-gray-400 col-span-full md:col-span-4 lg:col-span-4"
                                  style={{
                                    backgroundImage: `url(${post?.image})`,
                                    backgroundPosition: "center center",
                                    backgroundBlendMode: "multiply",
                                    backgroundSize: "cover",
                                  }}
                                ></div>
                                <div className="flex flex-col p-6 col-span-full row-span-full md:col-span-8 lg:col-span-8 lg:p-10">
                                  <div className="flex justify-start">
                                    <span className="px-2 py-1 text-xs rounded-full bg-violet-400 text-gray-900">
                                      {post?.mainCategory}
                                    </span>
                                  </div>
                                  <h1 className="text-3xl font-semibold break-words">
                                    {post?.title}
                                  </h1>
                                  <p className="text-sm text-gray-400 mt-1">
                                    <DateTimeFormatter date={post?.createdAt} />
                                  </p>
                                  <p className="flex-1 pt-2 break-words">
                                    {post?.description?.length >= 100
                                      ? post?.description?.substring(0, 99) +
                                        "..."
                                      : post?.description}
                                  </p>

                                  <div className="flex items-center justify-between pt-2">
                                    <div className="flex space-x-2">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="w-5 h-5 text-gray-400"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                          clipRule="evenodd"
                                        ></path>
                                      </svg>
                                      <span className="self-center text-sm">
                                        by {userProfile?.firstName}{" "}
                                        {userProfile?.lastName}
                                      </span>
                                    </div>
                                    <Link
                                      to={`/posts/${post?._id}`}
                                      className="inline-flex items-center pt-2 pb-6 space-x-2 text-sm text-violet-400 hover:text-violet-600"
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
                          ))
                        )}
                        {userProfile?.posts?.length > 0 && (
                          <div className="p-5 bg-gray-900 text-gray-400 rounded-md">
                            <Pagination
                              totalResults={userProfile?.posts?.length}
                              resultsPerPage={resultsPerPage}
                              onChange={onPageChangeTable1}
                              label="Page navigation"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;
