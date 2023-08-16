import React from "react";
import {
  PencilAltIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import {
  addDislikeCommentAction,
  addLikeCommentAction,
} from "../../../redux/slices/comments/commentSlices";
import { useDispatch } from "react-redux";
import Moment from "react-moment";

const CommentDetails = (props) => {
  const dispatch = useDispatch();

  return (
    <article
      className="pt-4 pb-7 px-6 mb-5 text-base rounded-lg bg-gray-800"
      key={props?.comment?._id}
    >
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm text-white">
            <img
              draggable={false}
              className="mr-2 w-6 h-6 rounded-full"
              src={props?.comment?.user?.profilePicture}
              alt={props?.comment?.user?.email}
            />
            {props?.comment?.user?.firstName} {props?.comment?.user?.lastName}
          </p>
          <p className="text-sm text-gray-400">
            <Moment fromNow ago>
              {props?.comment?.createdAt}
            </Moment>{" "}
            ago
          </p>
        </div>
        <div className="inline-flex items-center text-sm font-medium text-center text-gray-400">
          {props?.loginUserAuth?.id === props?.comment?.user?._id ||
          props?.loginUserAuth?.isAdmin ? (
            <p className="flex">
              <Link
                to={`/update-comment/${props?.comment?._id}`}
                className="p-3"
              >
                {/* Edit Icon */}
                <PencilAltIcon className="h-5 mt-3 text-yellow-300 hover:text-yellow-500 hover:cursor-pointer" />
              </Link>
              {/* Delete icon */}
              <button
                onClick={() => props?.toggleShow(props?.comment?._id)}
                className="ml-3"
              >
                <TrashIcon className="h-5 mt-3 text-red-600 hover:text-red-800 cursor-pointer" />
              </button>
            </p>
          ) : null}
        </div>
      </footer>
      <div className="text-white">
        <p>{props?.comment?.description}</p>
      </div>

      {props?.loginUserAuth ? (
        <div className="flex items-center mt-4">
          <div className="flex items-center mr-4">
            <button
              onClick={() => {
                dispatch(addLikeCommentAction(props?.comment?._id));
              }}
            >
              <ThumbUpIcon
                className={`w-5 h-5 mr-1 ${
                  props?.comment?.likes?.length > 0 &&
                  props?.comment?.likes?.filter((like) => {
                    return (
                      like?.toString() === props?.loginUserAuth?.id?.toString()
                    );
                  }).length > 0
                    ? "text-green-400 hover:text-green-600"
                    : "text-gray-400 hover:text-green-600"
                }`}
              />
            </button>
            <span className="text-gray-400 text-sm">
              {props?.comment?.likes?.length}
            </span>
          </div>
          <div className="flex items-center mr-4">
            <button
              onClick={() => {
                dispatch(addDislikeCommentAction(props?.comment?._id));
              }}
            >
              <ThumbDownIcon
                className={`w-5 h-5 mr-1 ${
                  props?.comment?.disLikes?.length > 0 &&
                  props?.comment?.disLikes?.filter((dislike) => {
                    return (
                      dislike?.toString() ===
                      props?.loginUserAuth?.id?.toString()
                    );
                  }).length > 0
                    ? "text-red-400 hover:text-red-600"
                    : "text-gray-400 hover:text-red-600"
                }`}
              />
            </button>
            <span className="text-gray-400 text-sm">
              {props?.comment?.disLikes?.length}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-center mt-4">
          <div className="flex items-center mr-4">
            <ThumbUpIcon
              className={`w-5 h-5 mr-1 ${
                props?.comment?.likes?.length > 0 &&
                props?.comment?.likes?.filter((like) => {
                  return (
                    like?.toString() === props?.loginUserAuth?.id?.toString()
                  );
                }).length > 0
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            />
            <span className="text-gray-400 text-sm">
              {props?.comment?.likes?.length}
            </span>
          </div>
          <div className="flex items-center mr-4">
            <ThumbDownIcon
              className={`w-5 h-5 mr-1 ${
                props?.comment?.disLikes?.length > 0 &&
                props?.comment?.disLikes?.filter((dislike) => {
                  return (
                    dislike?.toString() === props?.loginUserAuth?.id?.toString()
                  );
                }).length > 0
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            />
            <span className="text-gray-400 text-sm">
              {props?.comment?.disLikes?.length}
            </span>
          </div>
        </div>
      )}
    </article>
  );
};

export default CommentDetails;
