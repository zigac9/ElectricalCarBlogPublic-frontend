import React from "react";
import ChargersMap from "../../img/coverImage/chargersMap.png";
import LatestPosts from "../Post/LatestPosts";
import ProfilePic from "../../img/profileImg/IMG_1810.JPG";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <section className="bg-gray-800 text-gray-100">
        <div className="container mx-auto flex flex-col items-center px-4 py-5 text-center md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-4xl font-bold leadi sm:text-5xl">
            Electrical car blog
          </h1>
        </div>
      </section>
      <section className="bg-gray-900 text-gray-100">
        <div className="container flex flex-col-reverse mx-auto lg:flex-row">
          <div className="flex flex-col px-6 py-8 space-y-6 rounded-sm sm:p-8 lg:p-12 lg:w-1/2 xl:w-2/5">
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">
                  Interactive User Experience: A Blend of Blogging and Social
                  Networking
                </p>
                <p className="leadi">
                  At its core, the application operates as a dynamic blog
                  platform, empowering users with the ability to create, edit,
                  or remove articles, conduct user searches, and more.
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">
                  Flexible Posting Options
                </p>
                <p className="leadi">
                  You have the flexibility to create both private and public
                  posts. You can dynamically update your posts while they are in
                  private mode, and when everything is ready, you can make them
                  public. Private posts allow you to plan your trips and view
                  chargers specifically for your own use. Additionally, the
                  application can recommend routes for you.
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">
                  Revolutionizing Electric Vehicle Travel: Seamless Journey
                  Planning at Your Fingertips
                </p>
                <p>
                  This application streamlines your electric vehicle journey
                  planning process. Leveraging the insights and experiences of
                  other users, it enables you to meticulously plot your route,
                  circumvent potential pitfalls, and ensure a seamless travel
                  experience. Its user-centric design helps to preempt
                  disappointments and promote efficient, eco-friendly travel.
                </p>
              </div>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                ></path>
              </svg>
              <div className="space-y-2">
                <p className="text-lg font-medium leadi">
                  Smart Route Optimization: Streamlined Navigation for Your
                  Electric Vehicle Journey
                </p>
                <p className="leadi">
                  Depending on your chosen route, the application autonomously
                  computes and presents you with the most efficient path,
                  optimizing your journey for maximum convenience and minimal
                  energy consumption.
                </p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 xl:w-3/5 bg-gray-900">
            <div className="flex items-center justify-center p-4 md:p-8 lg:p-12 h-full">
              <img
                src={ChargersMap}
                alt="chargersmap"
                className="rounded-lg shadow-lg bg-gray-500 aspect-video sm:min-h-96 lg:min-h-[25rem]"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </section>
      <LatestPosts />
      <div className="p-6 bg-gray-900 text-gray-100  ">
        <div className="flex flex-col justify-center space-y-4 md:space-y-0 md:space-x-6 md:flex-row ">
          <img
            src={ProfilePic}
            draggable={false}
            alt="Ziga Crv"
            className="self-center flex-shrink-0 w-24 h-24 object-cover border rounded-full md:justify-self-start bg-gray-500 border-gray-700"
          />
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold text-center md:text-left">
              Ziga Crv
            </h4>
            <p className="text-gray-400">
              I am a 22-year-old computer science student from Tolmin, Slovenia,
              currently enrolled at the University of Ljubljana. <br />{" "}
              Alongside my studies, I am gaining practical experience as a
              software developer at Marand d.o.o. <br />
              Additionally, this application serves as my diploma thesis,
              showcasing my skills and knowledge in the field of computer
              science.
            </p>
          </div>
        </div>
        <div className="flex justify-center pt-4 space-x-4 align-center">
          <a
            rel="noopener noreferrer"
            href="https://github.com/zigac9"
            aria-label="GitHub"
            target="_blank"
            className="p-2 rounded-md text-gray-100 hover:text-violet-400"
          >
            <svg
              viewBox="0 0 496 512"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 fill-current"
            >
              <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
            </svg>
          </a>
          <a
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/zigacrv/"
            aria-label="LinkedIn"
            target="_blank"
            className="p-2 rounded-md text-gray-100 hover:text-violet-400"
          >
            <svg
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 fill-current"
            >
              <path d="M437.3 0H74.7C33.5 0 0 33.5 0 74.7v362.7C0 478.5 33.5 512 74.7 512h362.7c41.2 0 74.7-33.5 74.7-74.7V74.7C512 33.5 478.5 0 437.3 0zM153.6 416H76.3V198.9h77.3V416zm-38.6-243c-25.5 0-46.2-20.7-46.2-46.2s20.7-46.2 46.2-46.2 46.2 20.7 46.2 46.2-20.7 46.2-46.2 46.2zm281.7 243h-77.3V305c0-20.7-.4-47.3-28.8-47.3-28.8 0-33.3 22.5-33.3 45.7V416h-77.3V198.9h74.7v24.4h1c10.4-19.7 35.7-40.6 73.5-40.6 78.6 0 93.1 51.8 93.1 119.2V416z"></path>
            </svg>
          </a>
          <Link
            rel="noopener noreferrer"
            to={"/contact-us"}
            aria-label="Email"
            className="p-2 rounded-md text-gray-100 hover:text-violet-400"
          >
            <svg
              viewBox="0 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 fill-current"
            >
              <path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
