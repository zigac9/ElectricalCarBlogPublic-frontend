import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  blockUserAction,
  deleteUserAction,
  followUserAction,
  unBlockUserAction,
  unfollowUserAction,
} from "../../../redux/slices/users/userSlices";
import { EmojiHappyIcon, MailIcon, XCircleIcon } from "@heroicons/react/solid";
import { EmojiSadIcon, HeartIcon } from "@heroicons/react/outline";
import PopUp from "../../Alert/PopUp";

const UserListButtons = (users) => {
  const user = users?.user;

  const sendMailNavigate = () => {
    history.push({
      pathname: `/send-email`,
      state: {
        email: user?.email,
        userId: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
    });
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const { loginUserAuth } = useSelector((state) => state.users);
  const { isAdmin } = loginUserAuth;

  const [isFollowed, setIsFollowed] = useState(false);

  const [basicModal, setBasicModal] = useState(false);
  const [userId, setUserId] = useState("");

  const toggleShow = (getUserId) => {
    setBasicModal(!basicModal);
    setUserId(getUserId);
  };

  const toggleDelete = () => {
    setBasicModal(!basicModal);
    dispatch(deleteUserAction(userId));
  };

  useEffect(() => {
    const isFollower = user?.followers?.find(
      (follower) => follower?.id === loginUserAuth?._id
    );
    setIsFollowed(!!isFollower);
  }, [user?.followers, loginUserAuth?._id, user]);

  return (
    <>
      {basicModal && (
        <PopUp
          toggleShow={toggleShow}
          toggleDelete={toggleDelete}
          message="Are you sure you want to delete this user?"
          messageConf="If you confirm to delete, you will not be able to recover this user later."
        />
      )}
      <div className="flex flex-col space-y-2">
        {loginUserAuth && (
          <>
            {isAdmin && (
              <button
                onClick={() => {
                  if (user?.isBlocked) {
                    dispatch(unBlockUserAction(user?._id));
                  } else {
                    dispatch(blockUserAction(user?._id));
                  }
                }}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-gray-900" ${
                  user?.isBlocked
                    ? "bg-gray-500 hover:bg-gray-600"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {user?.isBlocked ? (
                  <EmojiHappyIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-100"
                    aria-hidden="true"
                  />
                ) : (
                  <EmojiSadIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-100"
                    aria-hidden="true"
                  />
                )}

                <span className="font-semibold title-font">
                  {user?.isBlocked ? "Unblock" : "Block"}
                </span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => toggleShow(user?._id)}
                className={`inline-flex items-center px-4 py-2 rounded-lg text-white
                  bg-red-800 hover:bg-red-950`}
              >
                <XCircleIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-100"
                  aria-hidden="true"
                />
                <span className="font-semibold title-font">Delete User</span>
              </button>
            )}
            {isFollowed ? (
              <button
                onClick={() => dispatch(unfollowUserAction(user?._id))}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-violet-200 text-gray-900  hover:bg-violet-300"
              >
                <EmojiSadIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-100"
                  aria-hidden="true"
                />
                <span className="font-semibold title-font">Unfollow</span>
              </button>
            ) : (
              <button
                onClick={() => dispatch(followUserAction(user?._id))}
                type="button"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-violet-400 text-gray-900 hover:bg-violet-500"
              >
                <HeartIcon
                  className="-ml-1 mr-2 h-5 w-5 text-gray-100"
                  aria-hidden="true"
                />
                <span className="font-semibold title-font">Follow</span>
              </button>
            )}
            <button
              onClick={sendMailNavigate}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-violet-400 text-gray-900 hover:bg-violet-500"
            >
              <MailIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-100"
                aria-hidden="true"
              />
              <span className="font-semibold title-font">Message</span>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default UserListButtons;
