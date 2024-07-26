import { useContext, useEffect, useState } from "react";
import { PlaygroundContext } from "../../PlaygroundContext";
import styles from "./index.module.scss";
import cs from "classnames";

export default function FileNameList() {
  const { files, selectedFileName, addFile, setSelectedFileName } =
    useContext(PlaygroundContext);

  const [tabs, setTabs] = useState([""]);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  return (
    <div className={styles.container}>
      {tabs.map((fileName, index) => (
        <div
          key={fileName}
          className={cs(
            styles.itemContainer,
            selectedFileName === fileName ? styles.active : ""
          )}
        >
          <div
            className={cs(styles.item)}
            onClick={() => setSelectedFileName(fileName)}
          >
            {fileName}
          </div>
          <div className={styles.remove}>
            <svg width="12" height="12" viewBox="0 0 24 24">
              <line stroke="#999" x1="18" y1="6" x2="6" y2="18"></line>
              <line stroke="#999" x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      ))}

      <button className={styles.button} onClick={() => addFile("filename.tsx")}>
        +
      </button>
    </div>
  );
}
