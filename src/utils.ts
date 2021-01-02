export const checkFavIcon = (url: string): boolean => {
  return containsWords(url, ["favicon", "favicons"]);
};

export const checkMedia = (url: string): boolean => {
  return containsWords(url, ["blob", "mp4", "webm"]);
};

const containsWords = (str: string, words: string[]): boolean => {
  return new RegExp(words.join("|")).test(str);
};
