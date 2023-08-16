import React, { useEffect } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategoriesAction } from "../../../redux/slices/category/categorySlices";

const CategoriesDropDown = (props) => {
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

export default CategoriesDropDown;
