import Dropzone from "react-dropzone";
import { PlusCircleIcon } from "@heroicons/react/solid";
import React from "react";

const ImageDropDown = ({ formik, maxSize }) => {
  return (
    <Dropzone
      onDrop={(acceptedFiles) => {
        formik.setFieldValue("image", acceptedFiles[0]);
      }}
      maxSize={10000000}
      accept={{ "image/*": [".jpeg", ".png"] }}
    >
      {({
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragReject,
        isDragActive,
      }) => (
        <div className="mt-1">
          <div
            {...getRootProps()}
            className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
          >
            <div className="space-y-1 text-center">
              <PlusCircleIcon
                className="mx-auto h-12 w-12 text-gray-400"
                aria-hidden="true"
              />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input
                    {...getInputProps()}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                {isDragAccept && (
                  <p className="pl-1">All files will be accepted</p>
                )}
                {isDragReject && (
                  <p className="pl-1">Some files will be rejected</p>
                )}
                {!isDragActive && (
                  <p className="pl-1">drag or drop some files here ...</p>
                )}
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default ImageDropDown;
