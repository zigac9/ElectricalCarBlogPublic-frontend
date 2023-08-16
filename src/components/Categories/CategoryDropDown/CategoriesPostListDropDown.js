import React, { useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategoriesAction } from "../../../redux/slices/category/categorySlices";

const CategoriesPostListDropDown = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategoriesAction());
  }, [dispatch]);

  const categories = useSelector((state) => state?.category);
  const { loading, categoryList } = categories;

  const allCategories = categoryList?.map((category) => {
    return { value: category?._id, label: category?.title };
  });

  const getDefaultValue = () => {
    if (props?.defaultValue) {
      return allCategories?.find(
        (category) => category?.label === props?.defaultValue?.label
      );
    }
  };

  //handle change
  const handleChange = (value) => {
    props.onChange("mainCategory", value);
  };

  //handle blur
  const handleBlur = () => {
    props.onBlur("mainCategory", true);
  };

  return (
    <div style={{ margin: "0.2rem 0" }}>
      {loading ? (
        <h3 className={"text-base text-green-600"}>
          Product categories list are loading please wait...
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
          id="mainCategory"
          options={allCategories}
          value={props?.value?.label}
          defaultValue={getDefaultValue}
        />
      )}
      {props?.error && <div style={{ color: "red" }}>{props?.error}</div>}
    </div>
  );
};

export default CategoriesPostListDropDown;
