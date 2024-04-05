import { useState, useEffect } from "react";
import "./videoList.scss";
import "../../commonHeader.scss";
import { useNavigate } from "react-router-dom";
import Pagination from "../../Pagination/Pagination";
import VideoListTable from "./VideoListTable";
import { usePagination } from "../../Pagination/usePagination";

import GetApi from "../../services/GetApi";
import { allRoutes } from "../../routes/path";
import VideoCategory from "../AddVideo/VideoCategory";
import DeleteApi from "../../services/Delete";
import { ToastSuccess, ToastFailure } from "../../Utils/Toast/ToastMsg";

const pageLimit = 10;
function VideoList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [noRowsData, setNoRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });

  async function getVideoList() {
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
      const response = await GetApi("api/video/get", params);

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
    getVideoList();
  }, [currentPage, selectedCategory, selectedSubCategory]);

  const navigate = useNavigate();
  const handleAddNewVideo = () => {
    navigate(allRoutes.addVideo);
  };

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

  const handleDeleteVideo = async (id) => {
    const API = `api/video/delete/${id}`;
    try {
      const response = await DeleteApi(API);
      if (response.status >= 200 && response.status < 300) {
        ToastSuccess(response?.data?.message);
        setCurrentPage(1);
        getVideoList();
      } else {
        ToastFailure(response?.data?.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="employeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="employeeHeader">
              <div className="employeeheading">
                <h2>Videos</h2>
              </div>

              <div className="addEmployeeBtn">
                <button
                  className="addCategoryButton"
                  onClick={() => handleAddNewVideo()}
                >
                  Add Video
                </button>
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
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="employeTable">
              <VideoListTable
                loading={loading}
                currentPage={currentPage}
                getSerialNumber={getSerialNumber}
                currentTableData={noRowsData || []}
                handleDeleteVideo={handleDeleteVideo}
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
export default VideoList;
