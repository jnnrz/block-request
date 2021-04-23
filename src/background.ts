import {
  browser,
  Runtime,
  WebRequest,
  Storage,
} from "webextension-polyfill-ts";
import { checkMedia } from "./utils";
import StorageChange = Storage.StorageChange;

let isImagesBlocked = false;
let isMediaBlocked = false;
let isJavascriptBlocked = false;
let whitelist = [];

const main = () => {
  browser.runtime.onInstalled.addListener(onInstall);

  browser.storage.onChanged.addListener(onStorageChange);

  browser.webRequest.onHeadersReceived.addListener(
    onRequest,
    {
      urls: ["<all_urls>"],
      types: [
        "xmlhttprequest",
        "image",
        "media",
        "websocket",
        "imageset",
        "other",
        "script",
        "stylesheet",
        "main_frame",
        "sub_frame",
      ],
    },
    ["blocking", "responseHeaders"]
  );
};

const onRequest = async (details: WebRequest.OnHeadersReceivedDetailsType) => {
  if (isMediaBlocked) {
    if (details.type === "media" || checkMedia(details.url)) {
      console.log("media: " + details.url);
      return { cancel: true };
    }
  }

  if (isImagesBlocked) {
    if (details.type === "image" || details.type === "imageset") {
      console.log("image: " + details.url);
      return { cancel: true };
    }
  }

  if (isJavascriptBlocked) {
    const headers = details.responseHeaders;
    headers.push({
      name: "Content-Security-Policy",
      value: "script-src 'none';",
    });

    return { responseHeaders: headers };
  }
};

const onInstall = async (details: Runtime.OnInstalledDetailsType) => {
  await reloadStorage();
};

const onStorageChange = async (
  changes: { [p: string]: StorageChange },
  areaName: string
) => {
  await reloadStorage();
};

const reloadStorage = async () => {
  const { status } = await browser.storage.local.get("status");
  const { wl } = await browser.storage.local.get("whitelist");

  isImagesBlocked = status.images;
  isMediaBlocked = status.media;
  isJavascriptBlocked = status.js;
  whitelist = wl;
};

main();
