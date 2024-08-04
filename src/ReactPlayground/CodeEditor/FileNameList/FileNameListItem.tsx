import { useRef, useState } from 'react';
import styles from './index.module.scss';
import cs from 'classnames';

export interface FileNameListItemProps {
  actived: boolean;
  value: string;
  onClick: () => void;
  onEditComplete: (name: string) => void;
  onRemove: (name: string) => void;
}

const FileNameListItem: React.FC<FileNameListItemProps> = (props) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.value);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDoubleClick() {
    setEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  }

  function handleInputOnBlur() {
    setEditing(false);
    props.onEditComplete(name);
  }

  return (
    <div
      className={cs(styles.itemContainer, props.actived ? styles.active : null)}
    >
      <div className={cs(styles.item)} onClick={props.onClick}>
        {editing ? (
          <input
            value={name}
            ref={inputRef}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleInputOnBlur}
          />
        ) : (
          <span onDoubleClick={handleDoubleClick}>{props.value}</span>
        )}
      </div>
      <div className={styles.remove} onClick={() => props.onRemove(name)}>
        <svg width='12' height='12' viewBox='0 0 24 24'>
          <line stroke='#999' x1='18' y1='6' x2='6' y2='18'></line>
          <line stroke='#999' x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
      </div>
    </div>
  );
};

export default FileNameListItem;
