import { XCircleIcon } from "@heroicons/react/outline";
import React from "react";

const PopUp = ({ toggleShow, toggleDelete, message, messageConf }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 mx-3">
      <div className="bg-gray-800 bg-opacity-50 fixed inset-0 z-40"></div>
      <div className="flex flex-col max-w-md gap-2 p-6 rounded-md shadow-md bg-gray-900 text-gray-100 relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{message}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={toggleShow}
          >
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <p className="flex-1 text-gray-400">{messageConf}</p>
        <div className="flex flex-col justify-center gap-3 mt-6 sm:flex-row">
          <button
            className="px-6 py-2 rounded-sm hover:text-gray-400"
            onClick={toggleShow}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 rounded-sm shadow-sm bg-blue-700 dtext-white hover:bg-blue-800"
            onClick={toggleDelete}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
