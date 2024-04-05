import { useState } from "react";
import { Modal } from "react-bootstrap";
import "./addCategory.scss";
import "../../Student/student.scss";
import InputFiedWithLabel from "../../../Components/InputFiedWithLabel";
import PostApi from "../../../services/PostApi";
import { ToastFailure, ToastSuccess } from "../../../Utils/Toast/ToastMsg";
import PutApi from "../../../services/PutApi";
import { useParams } from "react-router-dom";

function AddSubCategory({
  editMode,
  initialValue,
  getSubCategoryDetails,
  showModal,
  hideModalHandler,
}) {
  const [values, setValues] = useState(
    initialValue
      ? {
          subCategoryName: initialValue.subCategoryName,
          description: initialValue.description,
        }
      : { subCategoryName: "", description: "" }
  );

  const { categoryId } = useParams();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSaveData = async () => {
    if (editMode) {
      try {
        const subCategoryData = {
          subCategoryName: values.subCategoryName,
          description: values.description,
        };

        const endpoint = `api/subCategory/update`;
        const token = localStorage.getItem("token");
        const response = await PutApi(
          endpoint + "/" + initialValue.id,
          subCategoryData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response?.data?.statusCode >= 200 && response?.data?.statusCode < 300) {
          ToastSuccess(response.data.message);
          hideModalHandler();
          getSubCategoryDetails();
        } else {
          ToastFailure(response.data.message);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    } else {
      try {
        const subCategoryData = {
          subCategoryName: values.subCategoryName,
          description: values.description,
          categoryID: categoryId,
        };

        const response = await PostApi("api/subCategory/add", subCategoryData);

        if (response?.data?.statusCode >= 200 && response?.data?.statusCode < 300) {
          ToastSuccess(response?.data?.message);
          hideModalHandler();
          getSubCategoryDetails();
        } else {
          ToastFailure(response?.data?.message);
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  return (
    <>
      <Modal className="modelViewSession" show={showModal} onHide={hideModalHandler}>
        <Modal.Header closeButton>
          <Modal.Title className="modelHeading">
            {editMode ? "Edit sub Category" : "Add sub Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="addSubCategory">
            <InputFiedWithLabel
              label="Sub Category"
              name="subCategoryName"
              value={values.subCategoryName}
              onChange={handleInputChange}
              classnames="modelBody mt-3"
              labelInputClass="labelInput"
              maxLength={50}
            />
            <div className="mt-3">
              <label className="labelInput">Description</label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                className="description form-control"
                onChange={handleInputChange}
                maxLength={1000}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="modelButton"
            onClick={() => {
              handleSaveData();
            }}
            disabled={
              values.subCategoryName === "" || values.description === ""
            }
          >
            Save
          </button>

          <button className="modelButton" onClick={hideModalHandler}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddSubCategory;
