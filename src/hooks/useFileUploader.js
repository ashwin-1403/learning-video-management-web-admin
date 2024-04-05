import { useState } from "react";
import axios from "axios";

const useFileUploader = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [locationImg, setLocationImg] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const getChunkSize = async (fileSize) => {
    let FILE_CHUNK = 5242880;
    if (fileSize > 31457280) {
      FILE_CHUNK = Math.floor(fileSize / 6);
    }
    return FILE_CHUNK;
  };

  const getProviderIdFromUrl = (url) => {
    if (url) {
      const array = url.split("/");
      const id = array[array.length - 1];
      return id;
    }
  };

  const uploadMultipartFile = async (multipartData) => {
    const FILE_CHUNK_SIZE = await getChunkSize(multipartData.selectedFile.size);
    const fileSize = multipartData.selectedFile.size;

    let NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE);

    if (fileSize % FILE_CHUNK_SIZE > 0) {
      NUM_CHUNKS += 1;
    }

    const promisesArray = [];
    let start, end, blob;

    for (let index = 1; index < NUM_CHUNKS + 1; index++) {
      start = (index - 1) * FILE_CHUNK_SIZE;
      end = index * FILE_CHUNK_SIZE;

      if (index === NUM_CHUNKS - 1) {
        const lastChunkSize = fileSize - end;
        if (lastChunkSize < 5242880) {
          NUM_CHUNKS -= 1;
        }
      }

      blob =
        index < NUM_CHUNKS
          ? multipartData.selectedFile.slice(start, end)
          : multipartData.selectedFile.slice(start);

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}api/s3/getURL`,
        {
          params: {
            filename: multipartData.fileName,
            partNumber: index,
            uploadId: multipartData.uploadId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.statusCode === 200) {
        const signedUrl = response.data.data;
        const uploadResponse = axios.put(signedUrl, blob, {
          headers: { "Content-Type": multipartData.selectedFile.type },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(progress);
          },
        });
        promisesArray.push(uploadResponse);
      }
    }

    const resolvedArray = await Promise.all(promisesArray);

    const uploadPartsArray = resolvedArray.map((resolvedPromise, index) => ({
      ETag: JSON.parse(resolvedPromise.headers.etag),
      PartNumber: index + 1,
    }));

    const data = {
      filename: multipartData.fileName,
      parts: uploadPartsArray,
      uploadId: multipartData.uploadId,
    };

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "api/s3/complete",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLoading(false);
      if (response.data.statusCode === 200) {
        setLocationImg(getProviderIdFromUrl(response.data.data.Location));
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const uploadMultiPart = (files) => {
    const totalFileSize = files.reduce((acc, file) => acc + file.size, 0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const perFileSize = (file.size * 100) / totalFileSize;

      uploadMedia(file, i, perFileSize, files.length);
    }
  };

  const uploadMedia = async (selectedFile, i, percentagePerFile, arrLength) => {
    const extensionArr = selectedFile.name.split(".");
    const fileExtension = extensionArr[extensionArr.length - 1].toLowerCase();
    const contentTypeName = selectedFile.type;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}api/s3/start`,
        {
          extension: `.${fileExtension}`,
          contentType: contentTypeName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.statusCode === 200) {
        const uploadId = response.data.data.UploadId;
        const fileName = response.data.data.Key;
        const multipartData = {
          selectedFile,
          uploadId,
          fileName,
          i,
          percentagePerFile,
          arrLength,
        };
        uploadMultipartFile(multipartData);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  const handleInput = (event) => {
    setLoading(true);
    setUploadProgress(0);
    const fileData = [];
    for (let i = 0; i < event.target.files.length; i++) {
      fileData.push(event.target.files[i]);
    }
    setSelectedImage(fileData);
    uploadMultiPart(fileData);
  };

  return {
    loading,
    handleInput,
    selectedImage,
    uploadProgress,
    locationImg,
    error,
  };
};

export default useFileUploader;
