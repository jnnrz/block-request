import { browser, Runtime, WebRequest, Tabs } from "webextension-polyfill-ts";
import { BlockStatus } from "./types";
import { checkMedia } from "./utils";

let blockImage = false;
let blockMedia = false;
let blockJs = false;

const main = () => {
  browser.runtime.onInstalled.addListener(onInstall);

  browser.runtime.onMessage.addListener(receiveMessage);

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

const receiveMessage = async (message: any, sender: Runtime.MessageSender) => {
  const { status } = await browser.storage.local.get("status");

  let nw;

  switch (message) {
    case BlockStatus.IMAGE_BLOCK:
      blockImage = true;
      nw = { ...status, images: true };
      await browser.storage.local.set({ ["status"]: nw });
      break;

    case BlockStatus.IMAGE_UNBLOCK:
      blockImage = false;
      nw = { ...status, images: false };
      await browser.storage.local.set({ ["status"]: nw });
      break;

    case BlockStatus.MEDIA_BLOCK:
      blockMedia = true;
      nw = { ...status, media: true };
      await browser.storage.local.set({ ["status"]: nw });
      break;

    case BlockStatus.MEDIA_UNBLOCK:
      blockMedia = false;
      nw = { ...status, media: false };
      await browser.storage.local.set({ ["status"]: nw });
      break;

    case BlockStatus.JS_BLOCK:
      blockJs = true;
      nw = { ...status, js: true };
      await browser.storage.local.set({ ["status"]: nw });
      break;

    case BlockStatus.JS_UNBLOCK:
      blockJs = false;
      nw = { ...status, js: false };
      await browser.storage.local.set({ ["status"]: nw });
      break;
  }
};

const onRequest = async (details: WebRequest.OnHeadersReceivedDetailsType) => {
  if (blockMedia) {
    if (details.type === "media" || checkMedia(details.url)) {
      console.log("media: " + details.url);
      return { cancel: true };
    }
  }

  if (blockImage || blockJs) {
    if (details.type === "image" || details.type === "imageset") {
      return { cancel: true };
    }

    const headers = details.responseHeaders;
    const cspHeader = headers.filter(
      (header) => header.name.toLowerCase() === "content-security-policy"
    );

    const previousValue = cspHeader.length > 0 ? cspHeader[0].value : "";

    const newCsp =
      (blockImage ? "img-src 'none'; " : blockJs ? "script-src 'none'; " : "") +
      previousValue;

    console.log(newCsp);

    headers.push({ name: "Content-Security-Policy", value: newCsp });
    return { responseHeaders: headers };
  }
};

const onInstall = async (details: Runtime.OnInstalledDetailsType) => {
  const { status } = await browser.storage.local.get("status");

  blockImage = status.images;
  blockMedia = status.media;
  blockJs = status.js;
};

main();
