import { createContext, PropsWithChildren, useState } from "react";
import { fileName2Language } from "./utils";
import { initFiles } from "./files";

export interface File {
  name: string;
  // code
  value: string;
  // file type
  language: string;
}

export interface Files {
  [key: string]: File;
}

type SetSelectedFileName = (fileName: string) => void;
type AddFile = SetSelectedFileName;
type RemoveFile = SetSelectedFileName;
type SetFiles = (files: Files) => void;
type UpdateFileName = (oldFileName: string, newFileName: string) => void;

export interface PlaygroundContext {
  files: Files;

  selectedFileName: string;
  setSelectedFileName: SetSelectedFileName;

  setFiles: SetFiles;
  addFile: AddFile;
  removeFile: RemoveFile;
  updateFileName: UpdateFileName;
}

export const PlaygroundContext = createContext<PlaygroundContext>({
  selectedFileName: "App.tsx",
} as PlaygroundContext);

export const PlaygroundProvider = (props: PropsWithChildren) => {
  const { children } = props;

  const [files, setFiles] = useState<Files>(initFiles);
  const [selectedFileName, setSelectedFileName] = useState<string>("App.tsx");

  const addFile: AddFile = (fileName: string) => {
    files[fileName] = {
      name: fileName,
      value: "",
      language: fileName2Language(fileName),
    };

    setFiles({ ...files });
  };

  const removeFile: RemoveFile = (fileName: string) => {
    delete files[fileName];
    setFiles({ ...files });
  };

  const updateFileName: UpdateFileName = (
    oldFileName: string,
    newFileName: string
  ) => {
    if (
      !files[oldFileName] ||
      newFileName === undefined ||
      newFileName === null
    )
      return;

    const { [oldFileName]: value, ...rest } = files;
    const newFile: File = {
      ...value,
      name: newFileName,
      language: fileName2Language(newFileName),
    };
    setFiles({
      ...rest,
      [newFileName]: newFile,
    });
  };

  return (
    <PlaygroundContext.Provider
      value={{
        files,
        selectedFileName,
        setSelectedFileName,
        setFiles,
        addFile,
        removeFile,
        updateFileName,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};
