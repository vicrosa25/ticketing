import { Fragment, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { SingleFile } from "./SingleFile";

export default function UploaderField({ url = "", images, setImages }) {
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // 1. Convert accepted files in the same form that rejectedFiles
    const acceptedMapped = acceptedFiles.map((file) => ({ file, errors: [] }));
    // 2. Put current, accepted and rejected files in the same array
    setFiles((curr) => [...curr, ...acceptedMapped, ...rejectedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  useEffect(() => {
    setImages(files.map((fileWrapper) => fileWrapper.url));
  }, [files]);

  const onUpload = (file, url) => {
    setFiles((curr) =>
      curr.map((fileWrapper) => {
        if (fileWrapper.file === file) {
          return { ...fileWrapper, url };
        }
        return fileWrapper;
      })
    );
  };

  const onDelete = (file) => {
    setFiles((curr) => curr.filter((fileWrapper) => fileWrapper.file !== file));
  };

  return (
    <Fragment>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>

      {files.map((fileWrapper, index) => (
        <SingleFile
          file={fileWrapper.file}
          onUpload={onUpload}
          onDelete={onDelete}
          key={index}
        />
      ))}
    </Fragment>
  );
}
