import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPostsAction } from "../../../redux/slices/posts/postSlices";
import Articles from "./Articles";

const RelatedArticles = (props) => {
  const dispatch = useDispatch();
  const [filteredPost, setFilteredPost] = useState([]);

  useEffect(() => {
    dispatch(fetchAllPostsAction());
  }, [dispatch]);

  const post = useSelector((state) => state.post);
  const { fetchAllPosts } = post;

  useEffect(() => {
    const posts = fetchAllPosts?.filter(
      (post) =>
        post?.mainCategory === props?.postDetails?.mainCategory &&
        post?._id !== props?.postDetails?._id &&
        post?.isPublic === true
    );
    const randomPosts = posts?.sort(() => Math.random() - 0.5).slice(0, 4);

    if (randomPosts?.length === 0) {
      const posts = fetchAllPosts?.filter(
        (post) =>
          post?._id !== props?.postDetails?._id && post?.isPublic === true
      );
      const randomPosts = posts?.sort(() => Math.random() - 0.5).slice(0, 4);
      setFilteredPost(randomPosts);
      return;
    }
    setFilteredPost(randomPosts);
  }, [
    fetchAllPosts,
    props?.postDetails?._id,
    props?.postDetails?.mainCategory,
  ]);

  return <Articles filteredPost={filteredPost} title="Related Articles" />;
};

export default RelatedArticles;
