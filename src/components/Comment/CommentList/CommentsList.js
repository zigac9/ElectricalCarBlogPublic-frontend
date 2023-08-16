import { deleteCommentAction } from "../../../redux/slices/comments/commentSlices";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import CommentDetails from "./CommentDetails";
import { Pagination } from "@windmill/react-ui";
import PopUp from "../../Alert/PopUp";

const CommentsList = (props) => {
  const dispatch = useDispatch();

  const comments = props?.comments;

  const resultsPerPage = 5;

  const user = useSelector((state) => state?.users);
  const { loginUserAuth } = user;

  const [basicModal, setBasicModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  const toggleShow = (getCommentId) => {
    setBasicModal(!basicModal);
    setCommentId(getCommentId);
  };

  const onPageChangeTable1 = (p) => {
    setPageTable1(p);
  };

  const toggleDelete = () => {
    setBasicModal(!basicModal);
    dispatch(deleteCommentAction(commentId));
  };

  const [pageTable1, setPageTable1] = useState(1);
  const [filteredComments, setFilteredComments] = useState([]);

  useEffect(() => {
    if (comments) {
      const startIndex = (pageTable1 - 1) * resultsPerPage;
      const endIndex = startIndex + resultsPerPage;

      const commentsSort = [...comments]?.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const slicedComments = commentsSort.slice(startIndex, endIndex);
      setFilteredComments(slicedComments);
    }
  }, [pageTable1, comments]);

  useEffect(() => {
    if (basicModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [basicModal]);

  return (
    <div>
      {basicModal && (
        <PopUp
          toggleShow={toggleShow}
          toggleDelete={toggleDelete}
          message="Are you sure you want to delete this comment?"
          messageConf="If you confirm to delete, you will not be able to recover this comment later."
        />
      )}
      <div>
        {comments?.length <= 0 ? (
          <h1 className={"text-center text-gray-500 text-xl"}>
            No comments posted yet
          </h1>
        ) : (
          filteredComments?.map((comment) => (
            <CommentDetails
              comment={comment}
              key={comment._id}
              toggleShow={toggleShow}
              loginUserAuth={loginUserAuth}
            />
          ))
        )}
        <Pagination
          totalResults={comments?.length}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable1}
          label="Page navigation"
        />
      </div>
    </div>
  );
};

export default CommentsList;
