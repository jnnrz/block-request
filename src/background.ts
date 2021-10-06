import Browser, {
  Runtime,
  WebRequest,
  Storage,
} from "webextension-polyfill";
import { checkMedia } from "./utils";

let isImagesBlocked = false;
let isMediaBlocked = false;
let isJavascriptBlocked = false;
let wl: Array<string>;

const main = () => {
  Browser.runtime.onInstalled.addListener(onInstall);

  Browser.storage.onChanged.addListener(onStorageChange);

  Browser.webRequest.onHeadersReceived.addListener(
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
  const { status } = await Browser.storage.local.get("status");
  const { whitelist } = await Browser.storage.local.get("whitelist");

  isImagesBlocked = status.images;
  isMediaBlocked = status.media;
  isJavascriptBlocked = status.js;
  wl = whitelist ? whitelist : [];
};

main();
