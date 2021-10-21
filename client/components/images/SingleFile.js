import { useEffect, useState } from "react";
import ProgressBar from "../ProgressBar.";
import FileHeader from "./FileHeader";

export function SingleFile({ file, onUpload, onDelete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function upload() {
      const imageData = await uploadFile(file, setProgress);
      onUpload(file, imageData);
    }

    upload();
  }, []);

  return (
    <div>
      <FileHeader file={file} onDelete={onDelete} />
      <ProgressBar completed={progress} />
    </div>
  );
}

function uploadFile(file, onProgress) {
  const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
  const key = "docs_upload_example_us_preset";

  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.onload = () => {
      const resp = JSON.parse(xhr.responseText);
      const imageData = {
        cloudId: resp.public_id,
        url: resp.url,
        secureUrl: resp.secure_url,
      };
      res(imageData);
    };
    xhr.onerror = (e) => rej(e);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = (event.loaded / event.total) * 100;
        onProgress(Math.round(percentage));
      }
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", key);

    xhr.send(formData);
  });
}
