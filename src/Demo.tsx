import React from "react";

import ReactDOM from "react-dom/client";

import { reviewButton } from "./ReviewButton";

const href = "https://growi.org/";

const HelloGROWI = reviewButton(() => <a href={href}>Hello, GROWI</a>);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelloGROWI href={href}>Hello, GROWI</HelloGROWI>
  </React.StrictMode>
);
