import { Link, Redirect } from "react-router-dom";
import {
  PencilAltIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addDislikeAction,
  addLikeAction,
  deletePostAction,
  fetchPostDetailsAction,
} from "../../../redux/slices/posts/postSlices";
import LoadingComponent from "../../../utils/LoadingComponent";
import AddComment from "../../Comment/AddComment";
import CommentsList from "../../Comment/CommentList/CommentsList";
import RelatedArticles from "../Articles/RelatedArticles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@windmill/react-ui";
import { deleteChargerAction } from "../../../redux/slices/evCharger/chargerSlices";
import UpdateCharger from "../../EvCharger/UpdateCharger";
import CreateCharger from "../../EvCharger/CreateCharger";
import PopUp from "../../Alert/PopUp";
import SelectedRouteDetails from "./SelectedRouteDetails";
import HeaderPostDetails from "./HeaderPostDetails";
import _ from "lodash";
import RecommendedRouteDetails from "./RecommendedRouteDetails";

const PostDetails = (props) => {
  const { id } = props.match.params;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [chargerToUpdate, setChargerToUpdate] = useState(null);
  const [updateModalIsOpen, setUpdateModalIsOpen] = useState(false);
  const [chargerId, setChargerId] = useState("");
  const [chargerBasicModal, setChargerBasicModal] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  const [postId, setPostId] = useState("");

  const dispatch = useDispatch();

  const toggleDeleteCharger = () => {
    setChargerBasicModal(!chargerBasicModal);
    dispatch(deleteChargerAction(chargerId));
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const toggleDelete = () => {
    setBasicModal(!basicModal);
    dispatch(deletePostAction(postId));
  };

  const post = useSelector((state) => state.post);
  const {
    loading: loadingPost,
    appErrPost,
    serverErrPost,
    fetchPostDetails: postDetails,
    isDeleted,
    addLike,
    addDislike,
    postUpdated,
  } = post;

  const comment = useSelector((state) => state.comment);
  const { commentCreated, commentDeleted, commentDisliked, commentLiked } =
    comment;

  const charger = useSelector((state) => state.charger);
  const {
    chargerCreatedUpdated,
    chargerDeleted,
    chargerUpdated,
    appErrCharger,
    serverErrCharger,
  } = charger;

  useEffect(() => {
    dispatch(fetchPostDetailsAction(id));
  }, [
    dispatch,
    id,
    commentCreated,
    commentDeleted,
    addLike,
    addDislike,
    commentDisliked,
    commentLiked,
    chargerUpdated,
    chargerDeleted,
    chargerCreatedUpdated,
  ]);

  const user = useSelector((state) => state.users);
  const { loginUserAuth } = user;

  const toggleShow = (getPostId) => {
    setBasicModal(!basicModal);
    setPostId(getPostId);
  };

  const toggleShowCharger = (getChargerId) => {
    setChargerBasicModal(!chargerBasicModal);
    setChargerId(getChargerId);
  };

  const openUpdateModal = (charger) => {
    setChargerToUpdate(charger);
    setUpdateModalIsOpen(true);
  };

  useEffect(() => {
    if (modalIsOpen || updateModalIsOpen || basicModal || chargerBasicModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [modalIsOpen, updateModalIsOpen, basicModal, chargerBasicModal]);

  /** Dont render map on postdetails change - SECTION TOP **/
  const [show, setShow] = useState(true);
  const [idPost, setIdPost] = useState(null);
  const [chargerArr, setChaergerArr] = useState([]);
  const [MemorizedSelectedRouteDetails, SetMemorizedSelectedRouteDetails] =
    useState(null);
  const [showRec, setShowRec] = useState(true);
  const [chargerArrRec, setChaergerArrRec] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [
    MemorizedRecommendedRouteDetails,
    SetMemorizedRecommendedRouteDetails,
  ] = useState(null);

  useEffect(() => {
    if (postDetails?._id) {
      if (idPost !== postDetails?._id) {
        setShow(false);
        setShowRec(false);
        setChaergerArr(postDetails?.chargers);
        setChaergerArrRec(postDetails?.recommendedChargers?.chargersAuto);
        setOrigin(postDetails?.startingLocation?.title);
        setDestination(postDetails?.endLocation?.title);
        setDescription(postDetails?.description);
        SetMemorizedSelectedRouteDetails(
          <SelectedRouteDetails postDetails={postDetails} />
        );
        SetMemorizedRecommendedRouteDetails(
          <RecommendedRouteDetails postDetails={postDetails} />
        );
        setIdPost(postDetails?._id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postDetails]);

  useEffect(() => {
    if (!show) {
      if (
        !_.isEqual(chargerArr, postDetails?.chargers) ||
        postDetails?.startingLocation?.title !== origin ||
        postDetails?.endLocation?.title !== destination ||
        postDetails?.description !== description
      ) {
        SetMemorizedSelectedRouteDetails(
          <SelectedRouteDetails postDetails={postDetails} />
        );
        setChaergerArr(postDetails?.chargers);
        setOrigin(postDetails?.startingLocation?.title);
        setDestination(postDetails?.endLocation?.title);
        setDescription(postDetails?.description);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    postUpdated,
    chargerUpdated,
    chargerDeleted,
    chargerCreatedUpdated,
    postDetails?.chargers,
  ]);

  useEffect(() => {
    if (!showRec) {
      if (
        !_.isEqual(
          chargerArrRec,
          postDetails?.recommendedChargers?.chargersAuto
        )
      ) {
        SetMemorizedRecommendedRouteDetails(
          <RecommendedRouteDetails postDetails={postDetails} />
        );
        setChaergerArrRec(postDetails?.recommendedChargers?.chargersAuto);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUpdated, postDetails?.recommendedChargers?.chargersAuto]);
  /** Dont render map on postdetails change - SECTION BOTTOM **/

  if (
    postDetails?.isPublic === false &&
    loginUserAuth.isAdmin === false &&
    loginUserAuth?.id !== postDetails?.user?.id
  ) {
    return <Redirect to={"/page-not-found"} />;
  }
  if (isDeleted) {
    return <Redirect to={"/posts"} />;
  }
  return (
    <>
      {basicModal && (
        <PopUp
          toggleShow={toggleShow}
          toggleDelete={toggleDelete}
          message="Are you sure you want to delete this post?"
          messageConf="If you confirm to delete, you will not be able to recover this post later."
        />
      )}

      {chargerBasicModal && (
        <PopUp
          toggleShow={toggleShowCharger}
          toggleDelete={toggleDeleteCharger}
          message="Are you sure you want to delete this charger?"
          messageConf="If you confirm to delete, you will not be able to recover this charger later."
        />
      )}

      {loadingPost &&
      !addDislike &&
      !addLike &&
      !commentDisliked &&
      !commentLiked &&
      !commentDeleted &&
      !commentCreated &&
      !chargerDeleted &&
      !chargerUpdated &&
      !chargerCreatedUpdated ? (
        <div className={"h-screen"}>
          <LoadingComponent />
        </div>
      ) : appErrPost || serverErrPost ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">
            {serverErrPost}! {appErrPost}
          </span>
        </div>
      ) : (
        <section className="pt-5 2xl:pt-10 bg-gray-800 overflow-hidden">
          <div className="container lg:px-10 px-4 mx-auto">
            {/* Post Header */}
            <HeaderPostDetails postDetails={postDetails} />

            {/* Post Description */}
            {MemorizedSelectedRouteDetails}

            {MemorizedRecommendedRouteDetails}
          </div>
          {loginUserAuth ? (
            <section className="py-6 bg-gray-800 text-gray-50">
              <div className="container mx-auto flex flex-col justify-around p-4 text-center lg:flex-row">
                <div className="flex flex-col justify-center lg:text-left">
                  <h1 className="py-2 text-3xl font-medium leadi title-font">
                    Do you like this post?
                  </h1>
                </div>
                <div className="flex flex-col items-center justify-center flex-shrink-0 mt-6 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:ml-4 lg:mt-0 lg:justify-end">
                  <button
                    onClick={() => {
                      dispatch(addLikeAction(postDetails?._id));
                    }}
                    className={`inline-flex items-center px-5 py-3 rounded-lg hover:bg-blue-950 ${
                      postDetails?.likes?.length > 0 &&
                      postDetails?.likes?.filter((like) => {
                        return like?.id === loginUserAuth?.id;
                      }).length > 0
                        ? "bg-blue-900"
                        : "bg-blue-700"
                    } text-white`}
                  >
                    <ThumbUpIcon className={`w-7 h-7 mr-1`} />
                    <span className="flex flex-col items-start ml-4 leadi">
                      <span className="font-semibold title-font">
                        Like - {postDetails?.likes?.length}
                      </span>
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      dispatch(addDislikeAction(postDetails?._id));
                    }}
                    className={`inline-flex items-center px-5 py-3 rounded-lg hover:bg-blue-950  ${
                      postDetails?.disLikes?.length > 0 &&
                      postDetails?.disLikes?.filter((dislike) => {
                        return dislike?.id === loginUserAuth?.id;
                      }).length > 0
                        ? "bg-blue-900"
                        : "bg-blue-700"
                    } text-white`}
                  >
                    <ThumbDownIcon className={`w-7 h-7 mr-1`} />
                    <span className="flex flex-col items-start ml-4 leadi">
                      <span className="font-semibold title-font">
                        Dislike - {postDetails?.disLikes?.length}
                      </span>
                    </span>
                  </button>
                </div>
              </div>
            </section>
          ) : null}
          {postDetails?.user?.id === loginUserAuth?.id ||
          loginUserAuth?.isAdmin ? (
            <>
              <section className="bg-gray-700 pt-4 pb-2 lg:pt-8 lg:pb-4">
                <div className="max-w-2xl mx-auto px-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                      Update post
                    </h2>
                  </div>
                  <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
                    <Link
                      to={`/update-post/${postDetails?._id}`}
                      className={`inline-flex items-center px-5 py-3 rounded-lg bg-green-700 hover:bg-green-800 text-white`}
                    >
                      <PencilAltIcon className={`w-7 h-7 mr-1`} />
                      <span className="flex flex-col items-start ml-4 leadi">
                        <span className="font-semibold title-font">
                          Edit post
                        </span>
                      </span>
                    </Link>
                    <button
                      onClick={() => toggleShow(postDetails?._id)}
                      className={`inline-flex items-center px-5 py-3 rounded-lg bg-red-700 hover:bg-red-800 text-white`}
                    >
                      <TrashIcon className={`w-7 h-7 mr-1`} />
                      <span className="flex flex-col items-start ml-4 leadi">
                        <span className="font-semibold title-font">
                          Delete post
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </section>
              <section className="bg-gray-700 py-4 lg:py-8">
                <div className="max-w-2xl mx-auto px-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg lg:text-2xl font-bold text-white">
                      Update chargers (change order in update post) (You can
                      only add up to 23 chargers!)
                    </h2>
                  </div>
                  <div>
                    {serverErrCharger || appErrCharger ? (
                      <div
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-2"
                        role="alert"
                      >
                        <strong className="font-bold">Error! </strong>
                        <span className="block sm:inline">
                          {serverErrCharger}! {appErrCharger}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    {postDetails?.chargers?.length > 0 && (
                      <TableContainer className="mb-2 mt-2 overflow-scroll md:overflow-auto lg:overflow-auto">
                        <Table>
                          <thead className="text-xs font-semibold tracking-wide text-left uppercase border-b border-gray-700 text-gray-400 bg-gray-800">
                            <tr>
                              <TableCell>Order number</TableCell>
                              <TableCell>Charger Provider</TableCell>
                              <TableCell>Address</TableCell>
                              <TableCell>Country</TableCell>
                              <TableCell>Actions</TableCell>
                            </tr>
                          </thead>
                          <TableBody>
                            {postDetails?.chargers?.map((charger, i) => (
                              <TableRow key={i} className="border-b">
                                <TableCell>
                                  <span className="text-sm">{i + 1}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {charger?.title}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {
                                      charger?.chargerInfo?.AddressInfo
                                        ?.AddressLine1
                                    }
                                    {", "}
                                    {
                                      charger?.chargerInfo?.AddressInfo.Postcode
                                    }{" "}
                                    {charger?.chargerInfo?.AddressInfo.Town}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">
                                    {
                                      charger?.chargerInfo?.AddressInfo?.Country
                                        .ContinentCode
                                    }
                                    {", "}
                                    {
                                      charger?.chargerInfo?.AddressInfo.Country
                                        .Title
                                    }
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {(charger?.user?.toString() ===
                                    loginUserAuth?.id?.toString() ||
                                    charger?.user?._id === loginUserAuth?.id ||
                                    loginUserAuth?.isAdmin) && (
                                    <span className="text-sm">
                                      <div className={"flex-col"}>
                                        <button
                                          onClick={(event) => {
                                            event.preventDefault();
                                            openUpdateModal(charger);
                                          }}
                                          className="ml-3"
                                        >
                                          <PencilAltIcon className="h-7 lg:h-5 md:h-5 mt-3 text-yellow-300 hover:text-yellow-500 hover:cursor-pointer" />
                                        </button>
                                        <button
                                          onClick={(event) => {
                                            event.preventDefault();
                                            toggleShowCharger(charger?._id);
                                          }}
                                          className="ml-3"
                                        >
                                          <TrashIcon className="h-7 lg:h-5 md:h-5 mt-3 text-red-600 hover:text-red-800 cursor-pointer" />
                                        </button>
                                      </div>
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-8">
                      <button
                        onClick={(event) => {
                          event.preventDefault();
                          openModal();
                        }}
                        className="flex items-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg mt-2"
                      >
                        <span className="mr-2">Add new charging point</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 19a1 1 0 01-1-1V11H1a1 1 0 010-2h7V1a1 1 0 012 0v8h7a1 1 0 110 2h-7v7a1 1 0 01-1 1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : null}
          {modalIsOpen && (
            <CreateCharger
              setModalIsOpen={setModalIsOpen}
              modalIsOpen={modalIsOpen}
              updateDispatch={true}
              postId={postDetails?._id}
              number={postDetails?.chargers?.length}
            />
          )}
          {updateModalIsOpen && (
            <UpdateCharger
              setUpdateModalIsOpen={setUpdateModalIsOpen}
              updateModalIsOpen={updateModalIsOpen}
              chargerToUpdate={chargerToUpdate}
            />
          )}
          <div className="bg-gray-900 py-8 lg:py-10">
            <div className="max-w-3xl mx-auto px-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  Discussion ({postDetails?.comments?.length})
                </h2>
              </div>

              {/* Add comment Form component here */}
              {loginUserAuth ? <AddComment postId={postDetails?._id} /> : null}
              <div>
                <CommentsList
                  comments={postDetails?.comments}
                  postId={postDetails?._id}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      {appErrPost || serverErrPost ? null : (
        <RelatedArticles postDetails={postDetails} />
      )}
    </>
  );
};

export default PostDetails;
