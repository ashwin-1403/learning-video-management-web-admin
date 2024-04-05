import { useEffect, useState } from "react";
import Pagination from "../../Pagination/Pagination";
import "../../commonHeader.scss";
import CategoryTable from "./CategoryList/CategoryTable";
import "../../Pagination/pagination.scss";
import GetApi from "../../services/GetApi";
import { usePagination } from "../../Pagination/usePagination";
import AddCategory from "./AddCategory/AddCategory";
import SearchIcon from "../../assets/img/searchIcon.png";
import useDebounce from "../../Components/useDebounce";
import DeleteApi from "../../services/Delete";
import PutApi from "../../services/PutApi";
import { ToastFailure, ToastSuccess } from "../../Utils/Toast/ToastMsg";

const pageLimit = 10;

export default function CategoryHeader() {
  const [currentPage, setCurrentPage] = useState(1);
  const [noRowsData, setNoRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 700, setCurrentPage);

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

      if (debouncedSearchTerm.length > 0) {
        params.search = debouncedSearchTerm;
      }

      setLoading(true);
      const response = await GetApi("api/category/get", params);

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
  }, [currentPage, debouncedSearchTerm]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEnableDisableAssignment = async ({ id, statusFlag }) => {
    try {
      const endpoint = `api/category/status/${statusHandler(
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

  const categoryDeleteHandler = async (categoryID) => {
    try {
      const response = await DeleteApi(`/api/category/delete/${categoryID}`);
      if (response.data.statusCode >= 200 && response.data.statusCode < 300) {
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

  const handleShow = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  return (
    <>
      <div className="employeeSection">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="employeeHeader">
                <div className="employeeheading">
                  <h2>Categories</h2>
                </div>

                <div className="addEmployeeBtn">
                  <button className="editButtonCategory" onClick={handleShow}>
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="searchInputSec">
            <input
              onChange={handleSearch}
              type="text"
              name="search"
              value={search}
              placeholder="Search..."
            />
            <img src={SearchIcon} alt="" />
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="employeTable">
                <CategoryTable
                  loading={loading}
                  currentPage={currentPage}
                  getSerialNumber={getSerialNumber}
                  currentTableData={noRowsData}
                  pageSize={pageLimit}
                  categoryDeleteHandler={categoryDeleteHandler}
                  getListData={getListData}
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
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddCategory
          getListData={() => {
            setCurrentPage(1);
            getListData();
          }}
          showModal={showModal}
          hideModalHandler={hideModalHandler}
          nameCategory=""
        />
      )}
    </>
  );
}
