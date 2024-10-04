import { useState, useRef, ChangeEvent } from "react";

export function useSelectFiles(acceptedFileTypes: string) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const FileInput = (
    <input
      ref={inputRef}
      type="file"
      accept={acceptedFileTypes}
      onChange={handleFileChange}
      style={{ display: "none" }}
    />
  );

  const selectFiles = () => {
    inputRef.current?.click();
  };

  return { selectedFiles, FileInput, selectFiles };
}
