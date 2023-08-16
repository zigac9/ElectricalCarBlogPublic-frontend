import React from "react";
import Moment from "react-moment";

const DateTimeFormatter = ({ date }) => {
  return <Moment format="MMMM DD, YYYY - HH:mm">{date}</Moment>;
};

const DateFormatter = ({ date }) => {
  return <Moment format="MMMM DD, YYYY">{date}</Moment>;
};

export { DateFormatter, DateTimeFormatter };
