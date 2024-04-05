import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PostApi from "../../services/PostApi";
import { ToastFailure, ToastSuccess } from "../../Utils/Toast/ToastMsg";
import VideoCategory from "../AddVideo/VideoCategory";
import useFileUploader from "../../hooks/useFileUploader";
import GetApi from "../../services/GetApi";
import PutApi from "../../services/PutApi";
import back from "../../assets/img/back.png";
import { allRoutes } from "../../routes/path";
import Loader from "../../Utils/Loader/Loader";

function AddAssignment() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [assignmentURL, setAssignmentURL] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const assignmentUploader = useFileUploader();

  const { assignmentId } = useParams();

  const handleCategorySelection = (name, value) => {
    if (name === "category") {
      setSelectedCategory(value);
    } else if (name === "subCategory") {
      setSelectedSubCategory(value);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleUpdateAssignmentDetails = async () => {
    const token = localStorage.getItem("token");
    const data = {
      fileName,
      description,
    };
    setLoading(true);
    try {
      const response = await PutApi(
        `api/assignment/update/${assignmentId}`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  const handleAddAssignmantDetails = async () => {
    const assignmentData = {
      subCategoryID: selectedSubCategory,
      assignmentURL: assignmentUploader.locationImg,
      description: description,
      fileName: fileName,
      categoryID: selectedCategory,
    };

    setLoading(true);
    try {
      const res = await PostApi("api/assignment/add", assignmentData);

      if (res?.data?.statusCode >= 200 && res?.data?.statusCode < 300) {
        ToastSuccess(res.data.message);
        setLoading(false);
        handleBackButton();
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

    if (assignmentId) {
      if (!fileName) {
        ToastFailure("Assignment name is required");
        return;
      }

      if (!description) {
        ToastFailure("Description is required");
        return;
      }
      handleUpdateAssignmentDetails();
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
        ToastFailure("Assignment name is required");
        return;
      }

      if (!description) {
        ToastFailure("Description is required");
        return;
      }

      if (!assignmentUploader.locationImg) {
        ToastFailure("Assignment URL is required");
        return;
      }

      handleAddAssignmantDetails();
    }
  };

  const getAssignmentById = async () => {
    try {
      const response = await GetApi(`api/assignment/get?aId=${assignmentId}`);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        const assignmentData = response?.data?.rows[0];

        if (assignmentData) {
          const categoryId = assignmentData?.subcategory?.category?.categoryName;
          const subCategoryId = assignmentData?.subcategory?.subCategoryName;
          const assignmentURL = assignmentData.assignmentURL;
          const fileName = assignmentData.fileName;
          const description = assignmentData.description;

          setSelectedCategory(categoryId);
          setSelectedSubCategory(subCategoryId);
          setDescription(description);
          setFileName(fileName);
          setAssignmentURL(assignmentURL);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    if (assignmentId) {
      getAssignmentById();
    }
  }, []);

  const handleBackButton = () => {
    navigate(allRoutes.assignment);
  };

  return (
    <div className="addVideoContainer">
      <div className="employeeheading m-1 d-flex gap-4">
        <button type="button" className="backButton" onClick={handleBackButton}>
          <img src={back} alt="Description" className="mb-3" />
        </button>
        {assignmentId ? <h2>Edit Assignment</h2> : <h2> Add Assignment</h2>}
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-lg-8  mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="videoFromContainer d-flex flex-column justify-content-end align-items-start p-1">
                <div className="searchInputSec mb-3">
                  <h2>
                    {assignmentId ? (
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
                            disabled={assignmentId ? true : false}
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
                            disabled={assignmentId ? true : false}
                          />
                        </div>
                      </>
                    ) : (
                      <VideoCategory
                        handleCategorySelection={handleCategorySelection}
                        initialCategory={selectedCategory}
                        initialSubCategory={selectedSubCategory}
                        operation={assignmentId}
                        isFilter={false}
                      />
                    )}
                  </h2>
                </div>
                <div className="searchInputSec d-flex flex-column mb-3">
                  <label className="text-sm text-light text-muted">
                    Assignment Name
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
                <div className="searchInputSec d-flex flex-column mb-3">
                  <div>
                    <label className="text-sm text-light text-muted">
                      {assignmentId
                        ? "Uploaded Assignment"
                        : "Upload Assignment"}
                    </label>
                    {assignmentId ? (
                      <a
                        href={assignmentURL}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue text-decoration-none subCategoryButton m-1"
                      >
                        Download PDF
                      </a>
                    ) : (
                      <input
                        type="file"
                        id="pdfFile"
                        className="form-control"
                        accept=".pdf"
                        onChange={assignmentUploader.handleInput}
                      />
                    )}
                  </div>
                </div>
                <textarea
                  id="description"
                  value={description}
                  placeholder="Description"
                  className="description form-control mb-3"
                  onChange={handleDescriptionChange}
                  maxLength={1000}
                />

                <div className="searchInputSec ">
                  <button type="submit" className="uploadVideoButton">
                    {assignmentId ? "Update" : "Submit"}
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

export default AddAssignment;
