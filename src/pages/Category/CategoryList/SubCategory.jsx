import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GetApi from "../../../services/GetApi";
import AddSubCategory from "../AddCategory/AddSubCategory";
import SubCategoryTable from "./SubCategoryTable";
import Pagination from "../../../Pagination/Pagination";
import { allRoutes } from "../../../routes/path";
import { usePagination } from "../../../Pagination/usePagination";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import Loader from "../../../Utils/Loader/Loader";
import useDebounce from "../../../Components/useDebounce";
import SearchIcon from "../../../assets/img/searchIcon.png";
import PutApi from "../../../services/PutApi";
import { ToastFailure, ToastSuccess } from "../../../Utils/Toast/ToastMsg";
import back from "../../../assets/img/back.png";
import { useParams } from "react-router-dom";
import DeleteApi from "../../../services/Delete";

const pageLimit = 10;

function SubCategory() {
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [noRowsData, setNoRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const debouncedSearchTerm = useDebounce(search, 700, setCurrentPage);

  const { getSerialNumber } = usePagination({
    totalItems,
    pageSize: pageLimit,
    siblingCount: 1,
    currentPage,
  });

  async function getSubCategoryDetails() {
    try {
      const params = {
        pageno: currentPage,
        pagesize: pageLimit,
        cId: categoryId,
      };

      if (debouncedSearchTerm.length > 0) {
        params.search = debouncedSearchTerm;
      }

      setLoading(true);
      const response = await GetApi(`api/subCategory/get`, params);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        setLoading(false);
        setNoRowsData(response?.data[0]?.rows || []);
        setTotalItems(response?.data[0]?.count);
        setCategoryName(response?.data[0]?.categoryName);
      } else {
        setLoading(false);
        setNoRowsData([]);
        setTotalItems(0);
        setCategoryName("");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getSubCategoryDetails();
  }, [currentPage, debouncedSearchTerm]);

  const handleBackButton = () => {
    navigate(allRoutes.category);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEnableDisableAssignment = async ({ id, statusFlag }) => {
    try {
      const endpoint = `api/subCategory/status/${statusHandler(
        statusFlag
      )?.toLowerCase()}/${id}`;
      const response = await PutApi(endpoint);
      if (
        response?.data?.statusCode >= 200 &&
        response?.data?.statusCode < 300
      ) {
        ToastSuccess(response?.data?.message);
        getSubCategoryDetails();
      } else {
        ToastFailure(response?.data?.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const subCategoryDeleteHandler = async (categoryID) => {
    try {
      const response = await DeleteApi(`/api/subCategory/delete/${categoryID}`);
      if (response.data.statusCode >= 200 && response.data.statusCode < 300) {
        ToastSuccess(response?.data?.message);
        setCurrentPage(1);
        getSubCategoryDetails();
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

  const handleShow = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  return (
    <>
      <div className="employeeSection">
        <div className="container">
          <div className="headerContent">
            <div className="d-flex gap-4">
              <button
                type="button"
                className="backButton"
                onClick={handleBackButton}
              >
                <img src={back} alt="Description" className="" />
              </button>
              <div className="employeeheading">
                <h2>{categoryName} </h2>
              </div>
            </div>
            <div className="employeeHeader">
              <div className="addEmployeeBtn">
                <button className="editButtonCategory" onClick={handleShow}>
                  Add Sub Category
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex">
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
          </div>

          {loading ? (
            <Loader startLoading={loading} />
          ) : (
            <>
              {noRowsData && noRowsData.length > 0 ? (
                <>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="employeTable">
                        <SubCategoryTable
                          currentPage={currentPage}
                          getSerialNumber={getSerialNumber}
                          currentTableData={noRowsData}
                          getSubCategoryDetails={getSubCategoryDetails}
                          handleEnableDisableAssignment={
                            handleEnableDisableAssignment
                          }
                          subCategoryDeleteHandler={subCategoryDeleteHandler}
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
                </>
              ) : (
                <DataNotAvailable />
              )}
            </>
          )}
        </div>
      </div>

      {showModal && (
        <AddSubCategory
          editMode={false}
          initialValue={null}
          getSubCategoryDetails={() => {
            setCurrentPage(1);
            getSubCategoryDetails();
          }}
          showModal={showModal}
          hideModalHandler={hideModalHandler}
        />
      )}
    </>
  );
}

export default SubCategory;
