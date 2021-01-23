import React, { FunctionComponent, useState, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";
import { Toggle } from "react-toggle-component";
import { BlockStatus } from "@src/types";

import styles from "./popup.scss";

const Popup: FunctionComponent = () => {
  const [blockImages, setBlockImages] = useState<boolean>(false);
  const [blockMedia, setBlockMedia] = useState<boolean>(false);
  const [blockOther, setBlockOther] = useState<boolean>(false);
  const [blockJs, setBlockJs] = useState<boolean>(false);
  const [blockCss, setBlockCss] = useState<boolean>(false);

  useEffect(async () => {
    const { status } = await browser.storage.local.get("status");

    setBlockImages(status.images);
    setBlockMedia(status.media);
    setBlockOther(status.other);
    setBlockJs(status.js);
    setBlockCss(status.css);
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

  const handleBlockJs = () => {
    browser.runtime.sendMessage(
      null,
      blockJs ? BlockStatus.JS_UNBLOCK : BlockStatus.JS_BLOCK
    );
    setBlockJs(!blockJs);
  };

  const handleBlockCss = async () => {
    await browser.runtime.sendMessage(
      null,
      blockCss ? BlockStatus.CSS_UNBLOCK : BlockStatus.CSS_BLOCK
    );
    setBlockCss(!blockCss);
  };

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["control-wrapper"]}>
        <div className={styles["control"]}>
          <label htmlFor="images">Images</label>
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="images"
            checked={blockImages}
            controlled={true}
            onToggle={handleBlockImages}
          />
        </div>
        <div className={styles["control"]}>
          <label htmlFor="media">Media</label>
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="media"
            checked={blockMedia}
            controlled={true}
            onToggle={handleBlockMedia}
          />
        </div>
        {/*<div className={styles["control"]}>
          <label htmlFor="other">Other</label>
          <input
            type="checkbox"
            name="other"
            checked={blockOther}
            onChange={handleBlockOther}
          />
        </div>*/}

        <div className={styles["control"]}>
          <label htmlFor="js">Javascript</label>
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="js"
            checked={blockJs}
            controlled={true}
            onToggle={handleBlockJs}
          />
        </div>

        {/*<div className={styles["control"]}>
          <label htmlFor="other">Css</label>
          <input
            type="checkbox"
            name="other"
            checked={blockCss}
            onChange={handleBlockCss}
          />
        </div>*/}
      </div>
    </div>
  );
};

export default Popup;
