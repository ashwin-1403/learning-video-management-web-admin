import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Pagination/Pagination";
import "../../commonHeader.scss";
import "../../Pagination/pagination.scss";
import GetApi from "../../services/GetApi";
import { usePagination } from "../../Pagination/usePagination";
import StudentTable from "./StudentTable";
import { allRoutes } from "../../routes/path";
import SearchIcon from "../../assets/img/searchIcon.png";
import useDebounce from "../../Components/useDebounce";
import DeleteApi from "../../services/Delete";
import PutApi from "../../services/PutApi";
import { ToastSuccess, ToastFailure } from "../../Utils/Toast/ToastMsg";

const pageLimit = 10;

function StudentComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [noRowsData, setNoRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(search, 700, setCurrentPage);

  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });

  const handleAddStudent = () => {
    navigate(allRoutes.addStudent);
  };

  async function getListData() {
    try {
      const params = {
        pageno: currentPage,
        pagesize: pageLimit,
      };

      if (debouncedSearchTerm.length > 0) {
        params.search = debouncedSearchTerm;
      }

      if (selectedCategory.length > 0) {
        params.cId = selectedCategory;
      }

      setLoading(true);

      const response = await GetApi("api/user/getAll", params);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        setLoading(false);
        setNoRowsData(response?.data?.rows || []);
        setTotalItems(response?.data?.count);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getListData();
  }, [currentPage, selectedCategory, debouncedSearchTerm]);

  useEffect(() => {
    getVideoCategory();
  }, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handleResetSession = async (studentId) => {
    try {
      const response = await DeleteApi(`api/user/device/${studentId}`);

      if (response.status >= 200 && response.status < 300) {
        ToastSuccess(response?.data?.message);
        getListData();
      } else {
        ToastFailure(response?.data?.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleEnableDisableAssignment = async ({ id, statusFlag }) => {
    try {
      const endpoint = `api/user/status/${statusHandler(
        statusFlag
      )?.toLowerCase()}/${id}`;
      const response = await PutApi(endpoint);
      if (
        response?.data?.statusCode >= 200 &&
        response?.data?.statusCode < 300
      ) {
        ToastSuccess(response?.data?.message);
        getListData();
      } else {
        ToastFailure(response?.data?.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const statusHandler = (flag) => {
    return flag ? "Disable" : "Enable";
  };

  async function getVideoCategory() {
    try {
      const response = await GetApi("api/category/get");

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        setCategories(response.data.rows);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  const handleCategorySelection = (event) => {
    setCurrentPage(1);
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="employeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="employeeHeader">
              <div className="employeeheading">
                <h2>Students</h2>
              </div>

              <div className="addEmployeeBtn">
                <button type="submit" onClick={handleAddStudent}>
                  Add student
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="videoCategory d-flex">
          <div className="searchInputSec student-search-mobile">
            <input
              onChange={handleSearch}
              type="text"
              name="search"
              value={search}
              placeholder="Search..."
            />
            <img src={SearchIcon} alt="" />
          </div>

          <div className="videoCategoryContainer">
            <select
              id="categorySelect"
              name="categoryID"
              value={selectedCategory}
              onChange={handleCategorySelection}
              className="form-select selectBox selectCategory "
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="employeTable">
              <StudentTable
                loading={loading}
                currentPage={currentPage}
                getSerialNumber={getSerialNumber}
                currentTableData={noRowsData || []}
                handleResetSession={handleResetSession}
                handleEnableDisableAssignment={handleEnableDisableAssignment}
                statusHandler={statusHandler}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Pagination
              className="pagination-bar"
              currentPage={currentPage}
              totalCount={totalItems || 0}
              pageSize={pageLimit}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentComponent;
