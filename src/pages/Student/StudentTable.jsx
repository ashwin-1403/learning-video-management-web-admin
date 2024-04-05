import "../Category/CategoryList/categoryTable.scss";
import { NavLink } from "react-router-dom";
import Table from "../table/Table";
import TableCol from "../table/TableCol";
import TableRow from "../table/TableRow";
import DataNotAvailable from "../../Components/DataNotFound/DataNotAvailable";
import Loader from "../../Utils/Loader/Loader";
import "./student.scss";
import ViewSession from "./ViewSession";
import { allRoutes } from "../../routes/path";
import { ConfirmPopup } from "../../Components/ConfirmationModal/confirmAlert";
import { useState } from "react";

export default function StudentTable(props) {
  const [showModal, setShowModal] = useState(false);

  const [studentData, setstudentData] = useState(null);

  const handleClose = () => setShowModal(false);

  const {
    loading,
    getSerialNumber,
    currentPage,
    currentTableData,
    handleResetSession,
    handleEnableDisableAssignment,
    statusHandler,
  } = props;

  if (currentTableData?.length === 0) {
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }

  return (
    <>
      <Table className="tableStationWidth">
        <TableCol>
          <th>S.No.</th>
          <th>Name</th>
          <th>Category</th>
          <th>Email</th>
          <th>Session</th>
          <th>Action</th>
        </TableCol>

        <TableRow>
          {currentTableData?.length === 0 ? (
            <p>Data Not Found !</p>
          ) : (
            currentTableData?.map((ele, ind) => (
              <tr key={ele.id}>
                <td>{getSerialNumber(currentPage, ind)}</td>
                <td>{ele.firstName} {ele.lastName}</td>
                <td>{ele?.category?.categoryName}</td>
                <td>{ele.email}</td>
                <td>
                  <button
                    className="subCategoryButton"
                    onClick={() => {
                      setstudentData(ele);
                      setShowModal(true);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="subCategoryButton text-danger ms-3"
                    onClick={() => ConfirmPopup(ele.id, handleResetSession)}
                  >
                    Reset
                  </button>
                </td>
                <td>
                  <NavLink
                    className="customNavLink subCategoryButton"
                    to={`${allRoutes.addStudent}/${ele.id}`}
                    state={{
                      firstName: ele.firstName,
                      lastName: ele.lastName,
                      studentId: ele.id,
                    }}
                  >
                    Edit
                  </NavLink>
                  <button
                    type="submit"
                    className={"subCategoryButton m-1 ms-3 " + (ele.isActive ? "redClr" : "greenClr")}
                    onClick={() =>
                      ConfirmPopup(
                        {
                          id: ele.id,
                          statusFlag: ele.isActive,
                        },
                        handleEnableDisableAssignment
                      )
                    }
                  >
                    {statusHandler(ele.isActive)}
                  </button>
                </td>
              </tr>
            ))
          )}
        </TableRow>
      </Table>
      {showModal && (
        <ViewSession
          showModal={showModal}
          studentData={studentData}
          handleClose={handleClose}
        />
      )}
    </>
  );
}
