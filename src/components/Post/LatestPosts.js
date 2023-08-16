import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPostsAction } from "../../redux/slices/posts/postSlices";
import Articles from "./Articles/Articles";

const LatestPosts = () => {
  const dispatch = useDispatch();
  const [filteredPost, setFilteredPost] = useState([]);

  useEffect(() => {
    dispatch(fetchAllPostsAction());
  }, [dispatch]);

  const post = useSelector((state) => state.post);
  const { fetchAllPosts } = post;

  useEffect(() => {
    // order by date
    if (!fetchAllPosts) return;

    const posts = [...fetchAllPosts]?.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const randomPosts = posts
      .filter((post) => post?.isPublic === true)
      .slice(0, Math.min(posts.length, 4));

    setFilteredPost(randomPosts);
  }, [fetchAllPosts]);

  return <Articles filteredPost={filteredPost} title="Latest posts" />;
};

export default LatestPosts;
