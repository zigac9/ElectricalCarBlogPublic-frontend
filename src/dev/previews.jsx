import React from "react";
import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox";
import { PaletteTree } from "./palette";
import PublicNavbar from "../components/Navigation/Public/PublicNavbar";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/PublicNavbar">
        <PublicNavbar />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
