import React from "react";
import { XCircleIcon } from "@heroicons/react/solid";

const PreviewImage = ({ formik }) => {
  return (
    <div>
      {formik?.values?.image && (
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Image preview
          </label>
          <div className="relative flex justify-center m-2">
            <img
              src={formik?.values?.image}
              alt="preview"
              className="object-cover"
              draggable={false}
            />
            {/* add remove image button */}
            <button
              type="button"
              className="absolute top-0 right-0 p-2 text-red-500 hover:text-red-700 bg-black"
              onClick={() => formik.setFieldValue("image", "")}
            >
              <XCircleIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewImage;
