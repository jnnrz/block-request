import Browser, { Tabs } from "webextension-polyfill";

export const checkFavIcon = (url: string): boolean => {
  return containsWords(url, ["favicon", "favicons"]);
};

export const checkMedia = (url: string): boolean => {
  return containsWords(url, [
    "blob",
    "mp4",
    "webm",
    "googlevideo",
    "data:image",
    "m3u8",
    "mp3",
    "stream",
  ]);
};

const containsWords = (str: string, words: string[]): boolean => {
  return new RegExp(words.join("|")).test(str);
};

export const getActiveTab = async (): Promise<Tabs.Tab> => {
  const tabs = await Browser.tabs.query({ active: true });
  return tabs[0];
};

export const getUrlFromActiveTab = async (): Promise<URL> => {
  const activeTab = await getActiveTab();
  return new URL(activeTab.url);
};
