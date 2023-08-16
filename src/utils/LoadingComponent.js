import React from "react";
import { RiseLoader } from "react-spinners";

const override: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const LoadingComponent = () => {
  return (
    <RiseLoader
      color={"red"}
      loading={true}
      cssOverride={override}
    ></RiseLoader>
  );
};

export default LoadingComponent;
