import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import dayjs from "dayjs";
import { Calendar } from "ui";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Calendar value={dayjs()} />
);
