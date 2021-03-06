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
        "imageset",
        "media",
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
  let csp = "";

  if (found) {
    return { responseHeaders: details.responseHeaders };
  }

  if (isMediaBlocked) {
    if (details.type === "media" || checkMedia(details.url)) {
      return { cancel: true };
    }
  }

  if (isImagesBlocked) {
    csp += " img-src 'none';";
  }

  if (isJavascriptBlocked) {
    csp += " script-src 'none';";
  }

  headers.push({
    name: "Content-Security-Policy",
    value: csp,
  });

  return { responseHeaders: headers };
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
