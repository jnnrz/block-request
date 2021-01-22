import Toggle from "@src/components/toggle";
import { BlockStatus } from "@src/types";
import React, { FunctionComponent, useState, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";

const Popup: FunctionComponent = () => {
  const [blockImages, setBlockImages] = useState<boolean>(false);
  const [blockMedia, setBlockMedia] = useState<boolean>(false);
  const [blockOther, setBlockOther] = useState<boolean>(false);

  useEffect(async () => {
    const { status } = await browser.storage.local.get("status");

    setBlockImages(status.images);
    setBlockMedia(status.media);
    setBlockOther(status.other);
  }, []);

  const handleBlockImages = () => {
    browser.runtime.sendMessage(
      null,
      blockImages ? BlockStatus.IMAGE_UNBLOCK : BlockStatus.IMAGE_BLOCK
    );
    setBlockImages(!blockImages);
  };

  const handleBlockMedia = () => {
    browser.runtime.sendMessage(
      null,
      blockMedia ? BlockStatus.MEDIA_UNBLOCK : BlockStatus.MEDIA_BLOCK
    );
    setBlockMedia(!blockMedia);
  };

  const handleBlockOther = () => {
    browser.runtime.sendMessage(
      null,
      blockOther ? BlockStatus.OTHER_UNBLOCK : BlockStatus.OTHER_BLOCK
    );
    setBlockOther(!blockOther);
  };

  return (
    <>
      <div>
        <label htmlFor="images">Images</label>
        <input
          type="checkbox"
          name="images"
          checked={blockImages}
          onChange={handleBlockImages}
        />
      </div>
      <div>
        <label htmlFor="media">Media</label>
        <input
          type="checkbox"
          name="media"
          checked={blockMedia}
          onChange={handleBlockMedia}
        />
      </div>
      <div>
        <label htmlFor="other">Other</label>
        <input
          type="checkbox"
          name="other"
          checked={blockOther}
          onChange={handleBlockOther}
        />
      </div>
    </>
  );
};

export default Popup;
