import {
  browser,
  Runtime,
  WebRequest,
  Storage,
} from "webextension-polyfill-ts";
import { checkFavIcon, checkMedia } from "./utils";

let isImagesBlocked = false;
let isMediaBlocked = false;
let isJavascriptBlocked = false;
let wl = [];

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
        "imageset",
        "script",
        "main_frame",
        "sub_frame",
      ],
    },
    ["blocking", "responseHeaders"]
  );
};

const onRequest = async (details: WebRequest.OnHeadersReceivedDetailsType) => {
  const host = new URL(details.url).hostname;
  const headers = details.responseHeaders;

  // Check if host is on the whitelist
  const found = wl.includes(host);

  if (found) {
    return { cancel: false };
  }

  if (isMediaBlocked) {
    if (details.type === "media" || checkMedia(details.url)) {
      console.log("media: " + details.url);
      return { cancel: true };
    }
  }

  if (isImagesBlocked) {
    if (details.type === "image" || details.type === "imageset") {
      if (checkFavIcon(details.url)) {
        return { cancel: false };
      }

      console.log("image: " + details.url);
      return { cancel: true };
    }
  }

  if (isJavascriptBlocked) {
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
  changes: { [p: string]: Storage.StorageChange },
  areaName: string
) => {
  await reloadStorage();
};

const reloadStorage = async () => {
  const { status } = await browser.storage.local.get("status");
  const { whitelist } = await browser.storage.local.get("whitelist");

  isImagesBlocked = status.images;
  isMediaBlocked = status.media;
  isJavascriptBlocked = status.js;
  wl = whitelist ? whitelist : [];
};

main();
