import { browser, Runtime, WebRequest } from "webextension-polyfill-ts";
import { BlockStatus } from "./types";
import { checkFavIcon, checkMedia } from "./utils";

let blockImage = false;
let blockMedia = false;
let blockOther = false;

const main = () => {
  browser.runtime.onMessage.addListener(receiveMessage);
  browser.webRequest.onBeforeRequest.addListener(
    beforeRequest,
    {
      urls: ["<all_urls>"],
      types: [
        "xmlhttprequest",
        "image",
        "media",
        "websocket",
        "imageset",
        "other",
      ],
    },
    ["blocking"]
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

    case BlockStatus.OTHER_BLOCK:
      blockOther = true;
      nw = { ...status, other: true };
      await browser.storage.local.set({ ["status"]: nw });
      break;

    case BlockStatus.OTHER_UNBLOCK:
      blockOther = false;
      nw = { ...status, other: false };
      await browser.storage.local.set({ ["status"]: nw });
      break;
  }
};

const beforeRequest = (details: WebRequest.OnBeforeRequestDetailsType) => {
  if (blockImage) {
    if (details.type === "image" || details.type === "imageset") {
      if (checkFavIcon(details.url)) {
        console.log("favicon: " + details.url);
        return { cancel: false };
      }
      console.log("image: " + details.url);
      return { cancel: true };
    }
  }

  if (blockMedia) {
    if (details.type === "media" || checkMedia(details.url)) {
      console.log("media: " + details.url);
      return { cancel: true };
    }
  }
};

main();
