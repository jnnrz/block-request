import React, { FunctionComponent, useState, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";
import { Toggle } from "react-toggle-component";
import { BlockStatus } from "@src/types";

import pic from "../../public/pic.png";
import vid from "../../public/video.png";
import cod from "../../public/code.png";
import mov from "../../public/movie.png";

import styles from "./popup.scss";

const Popup: FunctionComponent = () => {
  const [blockImages, setBlockImages] = useState<boolean>(false);
  const [blockMedia, setBlockMedia] = useState<boolean>(false);
  const [blockJs, setBlockJs] = useState<boolean>(false);

  useEffect(async () => {
    const { status } = await browser.storage.local.get("status");

    setBlockImages(status.images);
    setBlockMedia(status.media);
    setBlockJs(status.js);
  }, []);

  const handleBlockImages = async () => {
    await browser.runtime.sendMessage(
      null,
      blockImages ? BlockStatus.IMAGE_UNBLOCK : BlockStatus.IMAGE_BLOCK
    );
    setBlockImages(!blockImages);
  };

  const handleBlockMedia = async () => {
    await browser.runtime.sendMessage(
      null,
      blockMedia ? BlockStatus.MEDIA_UNBLOCK : BlockStatus.MEDIA_BLOCK
    );
    setBlockMedia(!blockMedia);
  };

  const handleBlockJs = async () => {
    await browser.runtime.sendMessage(
      null,
      blockJs ? BlockStatus.JS_UNBLOCK : BlockStatus.JS_BLOCK
    );
    setBlockJs(!blockJs);
  };

  return (
    <div className={styles["wrapper"]}>
      <div className={styles["control-wrapper"]}>
        <div className={styles["control"]}>
          <img src={pic} alt={"Images"} width={32} height={32} />
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="images"
            width="35px"
            height="20px"
            knobWidth="14px"
            knobHeight="14px"
            checked={blockImages}
            controlled={true}
            onToggle={handleBlockImages}
          />
        </div>
        <div className={styles["control"]}>
          <img src={vid} alt="Media" width={32} height={32} />
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="media"
            width="35px"
            height="20px"
            knobWidth="14px"
            knobHeight="14px"
            checked={blockMedia}
            controlled={true}
            onToggle={handleBlockMedia}
          />
        </div>
        <div className={styles["control"]}>
          <img src={cod} alt="Javascript" width={32} height={32} />
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="js"
            width="35px"
            height="20px"
            knobWidth="14px"
            knobHeight="14px"
            checked={blockJs}
            controlled={true}
            onToggle={handleBlockJs}
          />
        </div>
      </div>
    </div>
  );
};

export default Popup;
