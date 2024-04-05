import { useEffect, useState } from "react";
import Pagination from "../../Pagination/Pagination";
import "../../commonHeader.scss";
import "../../Pagination/pagination.scss";
import GetApi from "../../services/GetApi";
import { usePagination } from "../../Pagination/usePagination";
import DeleteApi from "../../services/Delete";
import { useNavigate } from "react-router";
import { allRoutes } from "../../routes/path";
import AssignmentTable from "./AssignmentTable";
import { ToastSuccess, ToastFailure } from "../../Utils/Toast/ToastMsg";
import VideoCategory from "../AddVideo/VideoCategory";

const pageLimit = 10;

export default function Assignment() {
  const [currentPage, setCurrentPage] = useState(1);
  const [noRowsData, setNoRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const navigate = useNavigate();
  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });

  async function getListData() {
    try {
      const params = {
        pageno: currentPage,
        pagesize: pageLimit,
      };

      if (selectedSubCategory.length > 0) {
        params.sId = selectedSubCategory;
      } else if (selectedCategory.length > 0) {
        params.cId = selectedCategory;
      }

      setLoading(true);
      const response = await GetApi("api/assignment/get", params);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        setLoading(false);
        setNoRowsData(response?.data?.rows || []);
        setTotalItems(response?.data?.count);
      } else {
        setLoading(false);
        setNoRowsData([]);
        setTotalItems(0);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getListData();
  }, [currentPage, selectedCategory, selectedSubCategory]);

  const handleCategorySelection = (name, value) => {
    setCurrentPage(1);
    if (name === "category") {
      setSelectedCategory(value);
    } else if (name === "subCategory") {
      setSelectedSubCategory(value);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSelectedCategory("");
    setSelectedSubCategory("");
  };

  const handleDeleteAssignment = async (AssignmentID) => {
    try {
      const response = await DeleteApi(`api/assignment/delete/${AssignmentID}`);

      if (response.status >= 200 && response.status < 300) {
        ToastSuccess(response?.data?.message);
        setCurrentPage(1);
        getListData();
      } else {
        ToastFailure(response?.data?.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddStudent = () => {
    navigate(allRoutes.addAssignment);
  };

  return (
    <div className="employeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="employeeHeader">
              <div className="employeeheading">
                <h2>Assignments</h2>
              </div>

              <div className="addEmployeeBtn">
                <button type="submit" onClick={handleAddStudent}>
                  Add Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="videoCategory d-flex">
          <VideoCategory
            handleCategorySelection={handleCategorySelection}
            initialCategory={selectedCategory}
            initialSubCategory={selectedSubCategory}
            isFilter={true}
          />
          <div>
            <button className="clearButton" onClick={handleRefresh}>
              Clear
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="employeTable">
              <AssignmentTable
                loading={loading}
                currentPage={currentPage}
                getSerialNumber={getSerialNumber}
                currentTableData={noRowsData}
                pageSize={pageLimit}
                handleDeleteAssignment={handleDeleteAssignment}
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
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
