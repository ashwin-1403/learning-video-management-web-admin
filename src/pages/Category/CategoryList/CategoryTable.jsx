import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./categoryTable.scss";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";
import DataNotAvailable from "../../../Components/DataNotFound/DataNotAvailable";
import Loader from "../../../Utils/Loader/Loader";
import AddCategory from "../AddCategory/AddCategory";
import { ConfirmPopup } from "../../../Components/ConfirmationModal/confirmAlert";
export default function CategoryTable(props) {
  const {
    loading,
    currentTableData,
    getSerialNumber,
    currentPage,
    categoryDeleteHandler,
    getListData,
    handleEnableDisableAssignment,
    statusHandler,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [categoryName, setNameCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");


  const navigate = useNavigate();

  if (!currentTableData || currentTableData.length === 0) {
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }

  const handleCategoryClick = (category) => {
    navigate(`/category/${category.id}/subcategory`);
  };

  const handleShow = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  return (
    <>
      <Table className="tableStationWidth">
        <TableCol>
          <th>S.No</th>
          <th>Category Name</th>
          <th>Sub Category </th>
          <th>Action</th>
        </TableCol>

        <TableRow>
          {currentTableData.map((category, index) => (
            <tr key={index}>
              <td>{getSerialNumber(currentPage, index)}</td>

              <td> {category.categoryName}</td>

              <td>
                <button
                  type="submit"
                  className="subCategoryButton m-1"
                  onClick={() => handleCategoryClick(category)}
                >
                  View List
                  <span className="detailsSubCategory ms-2">
                    [{category.subCategories.length}]
                  </span>
                </button>
              </td>

              <td>
                <div className="subCategoryAction">
                  <button
                    className="editButtonCategory"
                    onClick={() => {
                      setNameCategory(category.categoryName);
                      setCategoryId(category.id);
                      handleShow();
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="submit"
                    className={"subCategoryButton m-1 " + (category.isActive ? "redClr" : "greenClr")}
                    onClick={() =>
                      ConfirmPopup(
                        {
                          id: category.id,
                          statusFlag: category.isActive,
                        },
                        handleEnableDisableAssignment
                      )
                    }
                  >
                    {statusHandler(category.isActive)}
                  </button>
                  <button
                    type="submit"
                    className="subCategoryButton m-1 redClr"
                    onClick={() =>
                      ConfirmPopup(category.id, categoryDeleteHandler)
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </TableRow>
      </Table>
      {showModal && (
        <AddCategory
          className="greenClr"
          nameCategory={categoryName}
          categoryId={categoryId}
          getListData={getListData}
          showModal={showModal}
          hideModalHandler={hideModalHandler}
        />
      )}
    </>
  );
}
