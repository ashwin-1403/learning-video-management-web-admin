import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import VideoCategory from "./VideoCategory";
import "./addVideo.scss";
import GetApi from "../../services/GetApi";
import PostApi from "../../services/PostApi";
import { ToastFailure, ToastSuccess } from "../../Utils/Toast/ToastMsg";
import PutApi from "../../services/PutApi";
import back from "../../assets/img/back.png";
import { allRoutes } from "../../routes/path";
import useFileUploader from "../../hooks/useFileUploader";
import Loader from "../../Utils/Loader/Loader";

function AddVideo() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [videoURL, setVideoURL] = useState("");
  const [thumbnailURL, setThumbnailURL] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const thumbnailUploader = useFileUploader();

  const { videoId } = useParams();

  const handleCategorySelection = (name, value) => {
    if (name === "category") {
      setSelectedCategory(value);
    } else if (name === "subCategory") {
      setSelectedSubCategory(value);
    }
  };

  const handleUpdateVideoDetails = async () => {
    const token = localStorage.getItem("token");
    const data = {
      fileName,
      description,
    };
    setLoading(true);
    try {
      const response = await PutApi(`api/video/update/${videoId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (
        response?.data?.statusCode >= 200 &&
        response?.data?.statusCode < 300
      ) {
        ToastSuccess(response?.data?.message);
        setLoading(false);
        handleBackButton();
      } else {
        ToastFailure(response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  };

  const handleAddVideoDetails = async () => {
    const videoData = {
      subCategoryID: selectedSubCategory,
      videoURL: videoURL,
      description: description,
      fileName: fileName,
      categoryID: selectedCategory,
      thumbnail: thumbnailUploader.locationImg,
    };

    setLoading(true);
    try {
      const res = await PostApi("api/video/add", videoData);

      if (res?.data?.statusCode >= 200 && res?.data?.statusCode < 300) {
        ToastSuccess(res.data.message);
        setLoading(false);
        navigate(allRoutes.videoList);
      } else {
        ToastFailure(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videoId) {
      if (!fileName) {
        ToastFailure("Video title is required");
        return;
      }

      if (!description) {
        ToastFailure("Description is required");
        return;
      }
      handleUpdateVideoDetails();
    } else {
      if (!selectedCategory) {
        ToastFailure("Category is required");
        return;
      }

      if (!selectedSubCategory) {
        ToastFailure("Subcategory is required");
        return;
      }

      if (!fileName) {
        ToastFailure("Video title is required");
        return;
      }

      if (!description) {
        ToastFailure("Description is required");
        return;
      }

      if (!videoURL) {
        ToastFailure("Video code is required");
        return;
      }

      if (!thumbnailUploader.locationImg) {
        ToastFailure("Thumbnail is required");
        return;
      }

      handleAddVideoDetails();
    }
  };

  const getVideoDetails = async () => {
    try {
      const response = await GetApi(`api/video/get?vId=${videoId}`);

      // Extracting required data
      const videoData = response?.data?.rows[0];
      if (videoData) {
        const categoryId = videoData?.subcategory?.category?.categoryName;
        const subCategoryId = videoData?.subcategory?.subCategoryName;
        const videoURL = videoData.videoURL;
        const fileName = videoData.fileName;
        const description = videoData.description;
        const thumbnail = videoData.thumbnail;

        setDescription(description);
        setFileName(fileName);
        setVideoURL(videoURL);
        setThumbnailURL(thumbnail);
        setSelectedCategory(categoryId);
        setSelectedSubCategory(subCategoryId);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    if (videoId) {
      getVideoDetails();
    }
  }, []);

  const handleBackButton = () => {
    navigate(allRoutes.videoList);
  };

  return (
    <div className="addVideoContainer">
      <div className="container">
        <div className="d-flex gap-4">
          <button
            type="button"
            className="backButton"
            onClick={handleBackButton}
          >
            <img src={back} alt="Description" className="mb-3" />
          </button>
          <div className="employeeheading">
            <h2>{videoId ? "Edit Video" : "Add Video"}</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-8  mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="videoFromContainer d-flex flex-column justify-content-end align-items-start p-1">
                <div className="searchInputSec mb-3">
                  {videoId ? (
                    <>
                      <div className="mb-3">
                        <label className="text-sm text-light text-muted">
                          Category
                        </label>
                        <input
                          type=""
                          id="videoFile"
                          value={selectedCategory}
                          className="form-control"
                          disabled={videoId ? true : false}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-light text-muted">
                          Subcategory
                        </label>
                        <input
                          type=""
                          id="videoFile"
                          value={selectedSubCategory}
                          className="form-control"
                          disabled={videoId ? true : false}
                        />
                      </div>
                    </>
                  ) : (
                    <VideoCategory
                      handleCategorySelection={handleCategorySelection}
                      initialCategory={selectedCategory}
                      initialSubCategory={selectedSubCategory}
                      operation={videoId}
                      isFilter={false}
                    />
                  )}
                </div>

                <div className="searchInputSec d-flex flex-column mb-3">
                  <div>
                    <label className="text-sm text-light text-muted">
                      Video Title
                    </label>
                    <input
                      type=""
                      id="videoFile"
                      value={fileName}
                      className="form-control"
                      onChange={(e) => {
                        setFileName(e.target.value);
                      }}
                      maxLength={50}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="text-sm text-light text-muted">
                      Video Code
                    </label>
                    <input
                      type=""
                      id="videoFile"
                      value={videoURL}
                      className="form-control"
                      onChange={(e) => {
                        setVideoURL(e.target.value);
                      }}
                      disabled={videoId ? true : false}
                    />
                  </div>
                </div>

                <div className="searchInputSec d-flex flex-column mb-3">
                  <div>
                    <label className="text-sm text-light text-muted">
                      {videoId ? "Uploaded Thumbnail" : "Upload Thumbnail"}
                    </label>
                    {!videoId && (
                      <input
                        type="file"
                        id="pdfFile"
                        className="form-control"
                        accept="image/*"
                        onChange={thumbnailUploader.handleInput}
                      />
                    )}
                  </div>
                </div>

                {videoId && (
                  <div className="d-flex flex-column mb-3">
                    <img
                      src={thumbnailURL}
                      alt="Thumbnail"
                      width="200"
                      height="200"
                    />
                  </div>
                )}

                {!videoId && thumbnailUploader.locationImg && (
                  <div className="d-flex flex-column mb-3">
                    <img
                      src={`${process.env.REACT_APP_CLOUDFRONT_URL}${thumbnailUploader.locationImg}`}
                      alt="Thumbnail"
                      width="200"
                      height="200"
                    />
                  </div>
                )}
                <div className="searchInputSec d-flex flex-column mb-3">
                  <textarea
                    id="description"
                    value={description}
                    placeholder="Description"
                    className="description form-control mb-3"
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    maxLength={1000}
                  />
                </div>
                <div className="searchInputSec ">
                  <button type="submit" className="uploadVideoButton">
                    {videoId ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {loading && <Loader startLoading={loading} />}
    </div>
  );
}

export default AddVideo;
