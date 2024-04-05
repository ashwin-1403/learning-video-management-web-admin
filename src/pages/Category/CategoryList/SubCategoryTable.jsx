import { useState } from "react";
import "./categoryTable.scss";
import Table from "../../table/Table";
import TableCol from "../../table/TableCol";
import TableRow from "../../table/TableRow";
import AddSubCategory from "../AddCategory/AddSubCategory";
import { ConfirmPopup } from "../../../Components/ConfirmationModal/confirmAlert";

function SubCategoryTable({
  currentTableData,
  getSubCategoryDetails,
  handleEnableDisableAssignment,
  subCategoryDeleteHandler,
  statusHandler,
  getSerialNumber,
  currentPage,
}) {
  const [showModal, setShowModal] = useState(false);
  const [initialValue, setInitialValue] = useState(null);
  
  const handleShow = () => setShowModal(true);
  const hideModalHandler = () => setShowModal(false);

  return (
    <div>
      <Table className="tableStationWidth">
        <TableCol>
          <th>S.No.</th>
          <th>Sub Category Name</th>
          <th>Description</th>
          <th>Actions</th>
        </TableCol>

        <TableRow>
          {currentTableData.map((subcategory, index) => (
            <tr key={index}>
              <td>{getSerialNumber(currentPage, index)}</td>

              <td>{subcategory.subCategoryName}</td>
              <td>{subcategory.description}</td>
              <td>
                <div className="subCategoryAction">
                  <div className="addEmployeeBtn">
                    <button
                      className="editButtonCategory"
                      onClick={() => {
                        setInitialValue(subcategory);
                        handleShow();
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <button
                    type="submit"
                    className={"subCategoryButton m-1 " + (subcategory.isActive ? "redClr" : "greenClr")}
                    onClick={() =>
                      ConfirmPopup(
                        {
                          id: subcategory.id,
                          statusFlag: subcategory.isActive,
                        },
                        handleEnableDisableAssignment
                      )
                    }
                  >
                    {statusHandler(subcategory.isActive)}
                  </button>
                  <button
                    className="subCategoryButton m-1 redClr"
                    type="button"
                    onClick={() => {
                      ConfirmPopup(subcategory.id, subCategoryDeleteHandler);
                    }}
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
        <AddSubCategory
          editMode={true}
          initialValue={initialValue}
          getSubCategoryDetails={getSubCategoryDetails}
          showModal={showModal}
          hideModalHandler={hideModalHandler}
        />
      )}
    </div>
  );
}

export default SubCategoryTable;
