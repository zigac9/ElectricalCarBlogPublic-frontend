import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 shadow">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <span className="text-sm sm:text-center text-gray-400">
            © 2023 Electrical car blog™ . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
            <li>
              <a href={"/"} className="mr-4 hover:underline md:mr-6 ">
                Home
              </a>
            </li>
            <li>
              <a href={"/contact-us"} className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;
