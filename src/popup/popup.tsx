import React, { FunctionComponent, useState, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";
import { Toggle } from "react-toggle-component";
import { getUrlFromActiveTab } from "@src/utils";

import pic from "../../public/pic.png";
import vid from "../../public/video.png";
import cod from "../../public/code.png";
import wls from "../../public/add-list.png";

import styles from "./popup.scss";

const Popup: FunctionComponent = () => {
  const [blockImages, setBlockImages] = useState<boolean>(false);
  const [blockMedia, setBlockMedia] = useState<boolean>(false);
  const [blockJavascript, setBlockJavascript] = useState<boolean>(false);
  const [onWhitelist, setOnWhitelist] = useState<boolean>(false);
  const [whitelist, setWhitelist] = useState<string[]>([]);

  useEffect(async () => {
    const { status } = await browser.storage.local.get("status");
    const { whitelist } = await browser.storage.local.get("whitelist");

    setBlockImages(status.images);
    setBlockMedia(status.media);
    setBlockJavascript(status.js);
    setWhitelist(whitelist ? whitelist : []);

    const parsedUrl = await getUrlFromActiveTab();
    const found = whitelist.includes(parsedUrl.hostname);
    setOnWhitelist(found);
  }, []);

  const handleBlockImages = async () => {
    const { status } = await browser.storage.local.get("status");
    await browser.storage.local.set({
      ["status"]: { ...status, images: !blockImages },
    });

    setBlockImages(!blockImages);
  };

  const handleBlockMedia = async () => {
    const { status } = await browser.storage.local.get("status");
    await browser.storage.local.set({
      ["status"]: { ...status, media: !blockMedia },
    });
    setBlockMedia(!blockMedia);
  };

  const handleBlockJavascript = async () => {
    const { status } = await browser.storage.local.get("status");
    await browser.storage.local.set({
      ["status"]: { ...status, js: !blockJavascript },
    });
    setBlockJavascript(!blockJavascript);
  };

  const handleAddToWhitelist = async () => {
    const parsedUrl = await getUrlFromActiveTab();

    if (whitelist.length > 0) {
      const found = whitelist.includes(parsedUrl.hostname);

      if (found) {
        const filteredList: string[] = whitelist.filter(
          (el) => el !== parsedUrl.hostname
        );
        await browser.storage.local.set({ ["whitelist"]: [...filteredList] });
        setOnWhitelist(!onWhitelist);
        return;
      }
    }

    const newWhitelist = [...whitelist, parsedUrl.hostname];
    await browser.storage.local.set({ ["whitelist"]: newWhitelist });
    setOnWhitelist(!onWhitelist);
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
            checked={blockJavascript}
            controlled={true}
            onToggle={handleBlockJavascript}
          />
        </div>
        <div className={styles["control"]}>
          <img src={wls} alt="Add to whitelist" width={32} height={32} />
          <Toggle
            leftBackgroundColor="#c3c3c3"
            rightBackgroundColor="#51d7d0"
            rightBorderColor="rgba(54, 181, 169, 255)"
            leftKnobColor="#fff"
            rightKnobColor="#fff"
            borderWidth="1px"
            name="wl"
            width="35px"
            height="20px"
            knobWidth="14px"
            knobHeight="14px"
            checked={onWhitelist}
            controlled={true}
            onToggle={handleAddToWhitelist}
          />
        </div>
      </div>
    </div>
  );
};

export default Popup;
