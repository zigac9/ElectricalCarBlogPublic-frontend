import { Link } from "react-router-dom";
import React from "react";

const Articles = ({ filteredPost, title }) => {
  return (
    <>
      {filteredPost?.length >= 1 && (
        <aside
          aria-label="Related articles"
          className="py-6 lg:py-10 bg-gray-800 px-5"
        >
          <div className="px-4 mx-auto max-w-screen-2xl">
            <div className={"inline-flex mb-8 space-x-5"}>
              <h2 className="text-3xl font-bold text-white">{title}</h2>
              <button className="items-center py-2 px-4 text-s font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-900 hover:bg-blue-800">
                <Link to="/posts">View all</Link>
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredPost?.map((post) => (
                <article key={post?._id}>
                  <Link to={`/posts/${post?._id}`}>
                    <img
                      draggable={false}
                      src={post?.image}
                      className="mb-5 rounded-lg h-56 w-full object-cover hover:opacity-60"
                      alt={post?.title}
                    />
                  </Link>
                  <h2 className="mb-2 text-xl font-bold leading-tight text-white break-words">
                    {post?.title}
                  </h2>
                  <h3 className="mb-2 text-xs font-bold leading-tight text-white break-words">
                    {post?.mainCategory}
                  </h3>
                  <p className="mb-4 font-light text-gray-400 break-words">
                    {post?.description?.length >= 100
                      ? post?.description?.substring(0, 99) + "..."
                      : post?.description}
                  </p>
                  <Link
                    to={`/posts/${post?._id}`}
                    className="inline-flex items-center font-medium underline underline-offset-4 text-blue-700 hover:no-underline hover:text-blue-800"
                  >
                    <span>Read more</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

export default Articles;
