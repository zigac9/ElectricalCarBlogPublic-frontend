import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteCategory,
  fetchAllCategoriesAction,
} from "../../../redux/slices/category/categorySlices";
import CategoryListItem from "./CategoryListItem";
import Toggle from "react-toggle";
import PopUp from "../../Alert/PopUp";
import { PlusIcon } from "@heroicons/react/solid";
import { Redirect } from "react-router-dom";

const CategoriesList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [basicModal, setBasicModal] = useState(false);
  const [categoryId, setcategoryId] = useState("");
  const [pageTable1, setPageTable1] = useState(1);
  const [filteredCategory, setFilteredCategory] = useState([]);
  const [displayedCategory, setDisplayedCategory] = useState([]);
  const [filterYourCatgories, setFilterYourCatgories] = useState(false);
  const resultsPerPage = 10;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleShow = (categoryId) => {
    setcategoryId(categoryId);
    setBasicModal(!basicModal);
  };

  const toggleDelete = () => {
    setBasicModal(!basicModal);
    dispatch(deleteCategory(categoryId));
  };

  const onPageChangeTable1 = (p) => {
    setPageTable1(p);
  };

  const handleToggleChange = (event) => {
    setFilterYourCatgories(event.target.checked);
  };

  const categoryState1 = useSelector((state) => state.category);
  const { deletedCategory } = categoryState1;

  useEffect(() => {
    dispatch(fetchAllCategoriesAction());
  }, [dispatch, deletedCategory]);

  const categoryState = useSelector((state) => state.category);
  const { categoryList, appErrCategory, serverErrCategory } = categoryState;

  const users = useSelector((state) => state.users);
  const { loginUserAuth } = users;

  useEffect(() => {
    let filterCategories;
    if (filterYourCatgories) {
      filterCategories = categoryList?.filter(
        (category) => category?.user?.id === loginUserAuth?.id
      );
    } else {
      filterCategories = categoryList;
    }
    setFilteredCategory(
      filterCategories?.filter((category) =>
        category?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [categoryList, dispatch, loginUserAuth, searchQuery, filterYourCatgories]);

  useEffect(() => {
    if (filteredCategory) {
      const startIndex = (pageTable1 - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;

      const slicedCategory = filteredCategory.slice(startIndex, endIndex);
      setDisplayedCategory(slicedCategory);
    }
  }, [filteredCategory, pageTable1]);

  useEffect(() => {
    if (basicModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [basicModal]);

  const [redirect, setRedirect] = useState(false);
  const handleButtonClick = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/add-category" />;
  }
  return (
    <>
      {basicModal && (
        <PopUp
          toggleShow={toggleShow}
          toggleDelete={toggleDelete}
          message="Are you sure you want to delete this category?"
          messageConf="If you confirm to delete, you will not be able to recover this category later."
        />
      )}

      <div className={"bg-sky-950 min-h-screen"}>
        <article className="max-w-7xl px-6 py-12 mx-auto space-y-12 bg-sky-950 text-gray-50">
          <div className="w-full mx-auto space-y-4 text-center">
            <h1 className="text-4xl font-bold leadi md:text-5xl">
              Category List
            </h1>
            <p className="text-sm text-gray-400">
              Here are all the categories.
            </p>
            <button
              onClick={handleButtonClick}
              className={`inline-flex items-center px-4 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 text-white`}
            >
              <PlusIcon className={`w-5 h-5 mr-1`} />
              <span className="flex flex-col items-start ml-2 leadi">
                <span className="font-semibold title-font">
                  Add new category
                </span>
              </span>
            </button>
          </div>
          <div className="text-gray-100 grid">
            <label
              className="block text-white text-sm font-bold"
              htmlFor="search"
            >
              Search category
            </label>
            <fieldset className="w-full space-y-1 text-gray-100 mb-5">
              <label htmlFor="Search" className="hidden">
                Search
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <button
                    type="button"
                    title="search"
                    className="p-1 focus:outline-none focus:ring"
                  >
                    <svg
                      fill="currentColor"
                      viewBox="0 0 512 512"
                      className="w-4 h-4 text-gray-500"
                    >
                      <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                    </svg>
                  </button>
                </span>
                <input
                  type="search"
                  name="Search"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="py-2 pl-10 text-sm w-full sm:w-auto rounded-md focus:outline-none white text-gray-500 focus:bg-gray-200 focus:border-violet-400"
                />
              </div>
            </fieldset>
            <label className="flex items-center w-fit">
              <Toggle
                id="biscuit-status"
                defaultChecked={filterYourCatgories}
                aria-labelledby="biscuit-label"
                onChange={handleToggleChange}
                className="mr-2"
              />
              <span id="biscuit-label" className="text-white">
                Show only your categories
              </span>
            </label>
          </div>
          <div className="pt-12 border-t border-gray-200">
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex flex-col">
                {/*{loading &&*/}
                {/*!blockedUser &&*/}
                {/*!unblockedUser &&*/}
                {/*!unfollowedUser &&*/}
                {/*!followedUser ? (*/}
                {/*  <LoadingComponent />*/}
                {/*) : */}
                {/*{loading &&*/}
                {/*!blockedUser &&*/}
                {/*!unblockedUser &&*/}
                {/*!unfollowedUser &&*/}
                {/*!followedUser ? (*/}
                {/*  <LoadingComponent />*/}
                {/*) : */}
                {appErrCategory || serverErrCategory ? (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">
                      {serverErrCategory}! {appErrCategory}
                    </span>
                  </div>
                ) : null}
                <div>
                  <div className="container px-4 mx-auto">
                    <CategoryListItem
                      displayedCategory={displayedCategory}
                      onPageChangeParent={onPageChangeTable1}
                      filteredCategory={filteredCategory}
                      resultsPerPage={resultsPerPage}
                      loginUserAuth={loginUserAuth}
                      toggleShow={toggleShow}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default CategoriesList;
