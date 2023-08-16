import React, { useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersAction } from "../../../redux/slices/users/userSlices";

const UsersDropdown = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllUsersAction());
  }, [dispatch]);

  const users = useSelector((state) => state?.users);
  const { loading, allUsers } = users;

  const allUsersList = allUsers?.map((user) => {
    return { value: user?._id, label: user?.firstName + " " + user?.lastName };
  });

  //handle change
  const handleChange = (value) => {
    props.onChange("userId", value);
  };

  //handle blur
  const handleBlur = () => {
    props.onBlur("userId", true);
  };

  return (
    <div style={{ margin: "0.2rem 0" }}>
      {loading ? (
        <h3 className={"text-base text-green-600"}>
          Users list are loading please wait...
        </h3>
      ) : (
        <Select
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              padding: "2px",
              background: "#1f2937",
              borderColor: "#6b7280",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              color: "black",
            }),
            placeholder: (provided, state) => ({
              ...provided,
              color: "#d1d5db",
            }),
            singleValue: (provided, state) => ({
              ...provided,
              color: "white",
            }),
            multiValue: (styles) => {
              return {
                ...styles,
                backgroundColor: "#60a5fa",
              };
            },
            multiValueLabel: (styles) => ({
              ...styles,
              color: "#082f49",
            }),
            multiValueRemove: (styles) => ({
              ...styles,
              color: "#082f49",
              ":hover": {
                color: "#ff0000",
              },
            }),
          }}
          isMulti={props.isMulti}
          isClearable={true}
          onChange={handleChange}
          onBlur={handleBlur}
          id="userId"
          options={allUsersList}
          value={props?.value?.label}
        />
      )}
      {props?.error && <div style={{ color: "red" }}>{props?.error}</div>}
    </div>
  );
};

export default UsersDropdown;
