import { Link } from "react-router-dom";
import { DateFormatter } from "../../../utils/DateFormatter";
import {
  ChatAlt2Icon,
  EyeIcon,
  ThumbDownIcon,
  ThumbUpIcon,
} from "@heroicons/react/solid";
import React from "react";

const HeaderPostDetails = ({ postDetails }) => {
  return (
    <div className="relative flex flex-col-reverse py-10 sm:py-8 lg:pt-0 lg:flex-col lg:pb-0 w-full bg-white rounded">
      <div className="inset-y-0 top-0 right-0 z-0 w-full max-w-xl px-4 mx-auto md:px-0 lg:pr-0 lg:mb-0 lg:mx-0 lg:w-7/12 lg:max-w-full lg:absolute xl:px-0">
        <svg
          className="absolute left-0 hidden h-full text-white transform -translate-x-1/2 lg:block"
          viewBox="0 0 100 100"
          fill="currentColor"
          preserveAspectRatio="none slice"
        >
          <path d="M50 0H100L50 100H0L50 0Z" />
        </svg>
        <img
          className="object-cover w-full h-56 rounded shadow-lg lg:rounded-none lg:shadow-none md:h-80 lg:h-full"
          src={postDetails?.image}
          alt=""
          draggable={false}
        />
      </div>
      <div className="relative flex flex-col items-start w-full max-w-xl px-4 mx-auto md:px-0 lg:px-8 lg:max-w-screen-xl">
        <div className="mb-8 lg:my-10 lg:max-w-lg lg:pr-5">
          <div className={"inline-flex space-x-2"}>
            <p className="inline-block px-3 py-2 mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-teal-accent-400 bg-blue-700">
              {postDetails?.mainCategory}
            </p>
            <p className="inline-block px-3 py-2 mb-4 text-xs font-semibold tracking-wider text-white uppercase rounded-full bg-teal-accent-400 bg-blue-700">
              {postDetails?.isPublic ? "Public post" : "Private post"}
            </p>
          </div>
          <h2 className="mb-5 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl sm:leading-none break-words">
            {postDetails?.title}
          </h2>
          <h2 className="mb-2 font-sans text-xl tracking-tight text-gray-500 sm:leading-none break-words">
            <span className={"font-bold"}> Car name: </span>
            {postDetails?.carName}
          </h2>
          <h2 className="mb-2 font-sans text-xl tracking-tight text-gray-500 sm:leading-none break-words">
            <span className={"font-bold"}>Efficiency: </span>
            {postDetails?.efficiency} Wh/km
          </h2>
          <h2 className="mb-2 font-sans text-xl tracking-tight text-gray-500 sm:leading-none break-words">
            <span className={"font-bold"}>Max charger power: </span>
            {postDetails?.fastChargerPower} kW
          </h2>
          <h2 className="mb-5 font-sans text-xl tracking-tight text-gray-500 sm:leading-none break-words">
            <span className={"font-bold"}>Usable battery capacity: </span>
            {postDetails?.usableBatterySize} kWh
          </h2>
          <Link
            to={`/profile/${postDetails?.user?._id}`}
            className={"hover:opacity-80"}
          >
            <div className="flex items-center mt-8 space-x-4">
              <img
                draggable={false}
                src={postDetails?.user?.profilePicture}
                alt={postDetails?.user?.email}
                className="w-10 h-10 rounded-full bg-gray-500"
              />
              <div>
                <h3 className="text-sm font-medium">
                  {postDetails?.user?.firstName} {postDetails?.user?.lastName}
                </h3>
                <p className="text-sm text-gray-400">
                  <DateFormatter date={postDetails?.createdAt} />
                </p>
              </div>
            </div>
          </Link>
          <div className="grid grid-cols-2 grid-rows-2 lg:inline-flex lg:items-center mt-8 lg:space-x-0 gap-6">
            <div className="inline-flex items-center">
              <ThumbUpIcon className={"h-6 w-6"} />
              <span className="flex flex-col items-start leadi">
                <span className="font-semibold title-font">
                  {postDetails?.likes?.length} like
                  {postDetails?.likes?.length > 1 ||
                  postDetails?.likes?.length === 0
                    ? "s"
                    : ""}
                </span>
              </span>
            </div>
            <div className="inline-flex items-center">
              <ThumbDownIcon className={"h-6 w-6"} />
              <span className="flex flex-col items-start leadi">
                <span className="font-semibold title-font">
                  {postDetails?.disLikes?.length} dislike
                  {postDetails?.disLikes?.length > 1 ||
                  postDetails?.disLikes?.length === 0
                    ? "s"
                    : ""}
                </span>
              </span>
            </div>
            <div className="inline-flex items-center">
              <ChatAlt2Icon className={"h-6 w-6"} />
              <span className="flex flex-col items-start leadi">
                <span className="font-semibold title-font">
                  {postDetails?.comments?.length} comment
                  {postDetails?.comments?.length > 1 ||
                  postDetails?.comments?.length === 0
                    ? "s"
                    : ""}
                </span>
              </span>
            </div>
            <div className="inline-flex items-center">
              <EyeIcon className={"h-6 w-6"} />
              <span className="flex flex-col items-start leadi">
                <span className="font-semibold title-font">
                  {" "}
                  {postDetails?.numViews} view
                  {postDetails?.numViews > 1 || postDetails?.numViews === 0
                    ? "s"
                    : ""}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPostDetails;
