import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Footer from "./components/Footer/Footer";
import App from "./App";
import "./index.css";
import store from "./redux/store/store.js";
import { DevSupport } from "@react-buddy/ide-toolbox";
import { ComponentPreviews, useInitial } from "./dev";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <DevSupport
      ComponentPreviews={ComponentPreviews}
      useInitialHook={useInitial}
    >
      <App />
      <Footer />
    </DevSupport>
  </Provider>
);
