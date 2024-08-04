import { useContext, useEffect, useState } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';
import styles from './index.module.scss';
import cs from 'classnames';
import FileNameListItem from './FileNameListItem';

export default function FileNameList() {
  const {
    files,
    selectedFileName,
    addFile,
    setSelectedFileName,
    updateFileName,
    removeFile,
  } = useContext(PlaygroundContext);

  const [tabs, setTabs] = useState(['']);

  useEffect(() => {
    setTabs(Object.keys(files));
  }, [files]);

  function handleEditComplete(fileName: string, prevName: string) {
    updateFileName(prevName, fileName);
    setSelectedFileName(fileName);
  }

  return (
    <div className={styles.container}>
      {tabs.map((fileName, index) => (
        <FileNameListItem
          key={fileName + index}
          value={fileName}
          actived={selectedFileName === fileName}
          onClick={() => setSelectedFileName(fileName)}
          onEditComplete={(name) => handleEditComplete(name, fileName)}
          onRemove={removeFile}
        />
      ))}

      <button className={styles.button} onClick={() => addFile('filename.tsx')}>
        +
      </button>
    </div>
  );
}
