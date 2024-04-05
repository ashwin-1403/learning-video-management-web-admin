import { useState, useEffect } from "react";
import GetApi from "../../services/GetApi";
import "./videoCategory.scss";

function VideoCategory({
  handleCategorySelection,
  initialCategory,
  initialSubCategory,
  operation,
  category,
  categoryID,
  isFilter,
}) {
  console.log("operation", operation);
  const [categories, setCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    category: initialCategory || categoryID || "",
    subCategory: initialSubCategory || "",
  });

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    // Update selected category when categoryID changes
    if (categoryID) {
      setSelectedOption((prev) => ({ ...prev, category: categoryID }));
    }
  }, [categoryID]);

  async function getVideoCategory() {
    try {
      let params = {};

      if(!isFilter) {
        params.isActive = true;
      }
      const response = await GetApi("api/category/get", params);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        setCategories(response.data.rows);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  async function getSubCategories(categoryId) {
    try {

      let params = {};

      if(!isFilter) {
        params.isActive = true;
      }

      const response = await GetApi(`api/subCategory/get?cId=${categoryId}`, params);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        setSubCategories(response.data[0].rows);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getVideoCategory();
  }, []);

  useEffect(() => {
    if (selectedOption.category) {
      getSubCategories(selectedOption.category);
    }
  }, [selectedOption.category]);

  useEffect(() => {
    setSelectedOption({
      category: initialCategory || "",
      subCategory: initialSubCategory || "",
    });
  }, [initialCategory, initialSubCategory]);

  const handleOptionChange = (event) => {
    const { name, value } = event.target;
    setSelectedOption((prevSelectedOption) => {
      const updatedOption = { ...prevSelectedOption, [name]: value };
      handleCategorySelection(name, value, setSelectedOption);
      if (name === "category") {
        getSubCategories(value);
      }
      return updatedOption;
    });
  };

  return (
    <div className="videoCategoryContainer">
      <select
        id="categorySelect"
        name="category"
        value={selectedOption.category}
        onChange={handleOptionChange}
        className="form-select selectBox selectCategory "
        disabled={operation ? true : false}
      >
        <option value="">
          {operation ? initialCategory : "Select category"}
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.categoryName}
          </option>
        ))}
      </select>

      {!category && (
        <select
          id="stateSelect"
          name="subCategory"
          value={selectedOption.subCategory}
          onChange={handleOptionChange}
          className="form-select selectBox selectCategory"
          disabled={operation ? true : false}
        >
          <option value="">
            {operation ? initialSubCategory : "Select Subcategory"}
          </option>
          {subCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.subCategoryName}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default VideoCategory;
