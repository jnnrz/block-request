import * as React from "react";
import * as ReactDOM from "react-dom";
import Browser from "webextension-polyfill";
import Popup from "./popup";
import "../app.scss";

Browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(<Popup />, document.getElementById("popup"));
});
