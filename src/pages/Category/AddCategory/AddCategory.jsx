import { useState } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import "./addCategory.scss";
import "../../Student/student.scss";
import InputFiedWithLabel from "../../../Components/InputFiedWithLabel";
import PostApi from "../../../services/PostApi";
import { ToastFailure, ToastSuccess } from "../../../Utils/Toast/ToastMsg";

function AddCategory({ nameCategory, categoryId, getListData, showModal, hideModalHandler }) {

  const [categoryName, setNameCategory] = useState(nameCategory);
  const [error, setError] = useState(false);
  
  const handleAddCategory = (e) => {
    setNameCategory(e.target.value);
    setError(!e.target.value.trim());
  };

  const handleSaveData = async () => {
    if (typeof categoryName !== "string") {
      console.error("Category name is not a string");
      return;
    }

    const trimmedCategoryName = categoryName.trim();

    if (!trimmedCategoryName) {
      setError(true);
      return;
    }

    try {
      if (categoryId) {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}api/category/update/${categoryId}`,
          {
            categoryName: trimmedCategoryName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.statusCode >= 200 && response.data.statusCode < 300) {
          ToastSuccess(response.data.message);
          hideModalHandler();
          getListData();
        }else {
          ToastFailure(response.data.message);
        }
      } else {
        
        const response = await PostApi("api/category/add", {
          categoryName: trimmedCategoryName,
        });

        if (
          response?.data?.statusCode >= 200 &&
          response?.data?.statusCode < 300
        ) {
          ToastSuccess(response.data.message);
          hideModalHandler();
          getListData();
        }else {
          ToastFailure(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <>
      <Modal className="modelViewSession" show={showModal} onHide={hideModalHandler}>
        <Modal.Header closeButton>
          <Modal.Title className="modelHeading">
            {categoryId ? "Edit Category" : "Add Category"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputFiedWithLabel
            label="Category Name"
            name="inputName"
            value={categoryName}
            onChange={handleAddCategory}
            classnames="modelBody"
            labelInputClass="labelInput"
            maxLength={50}
          />
          {error && <p style={{ color: "red" }}>Please add a category name</p>}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="modelButton"
            onClick={handleSaveData}
            disabled={typeof categoryName !== "string" || !categoryName.trim()}
          >
            {categoryId ? 'Update' : 'Submit'}
          </button>

          <button className="modelButton" onClick={hideModalHandler}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default AddCategory;
