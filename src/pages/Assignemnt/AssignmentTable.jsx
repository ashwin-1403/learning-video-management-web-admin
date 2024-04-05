import { NavLink } from "react-router-dom";
import "../Category/CategoryList/categoryTable.scss";
import Table from "../table/Table";
import TableCol from "../table/TableCol";
import TableRow from "../table/TableRow";
import DataNotAvailable from "../../Components/DataNotFound/DataNotAvailable";
import Loader from "../../Utils/Loader/Loader";
import { allRoutes } from "../../routes/path";
import { ConfirmPopup } from "../../Components/ConfirmationModal/confirmAlert";

export default function AssignmentTable(props) {
  const {
    loading,
    currentTableData,
    getSerialNumber,
    currentPage,
    handleDeleteAssignment,
  } = props;

  if (!currentTableData || currentTableData.length === 0) {
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }

  return (
    <Table className="tableStationWidth">
      <TableCol>
        <th>S.No</th>
        <th>File Name</th>
        <th>Assignment</th>
        <th>Description</th>
        <th>Action</th>
      </TableCol>

      <TableRow>
        {currentTableData.map((category, index) => {
          return (
            <tr key={index}>
              <td>{getSerialNumber(currentPage, index)}</td>
              <td> {category.fileName}</td>

              <td>
                <a
                  href={category.assignmentURL}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue text-decoration-none subCategoryButton m-1"
                >
                  Download PDF
                </a>
              </td>
              <td>{category.description}</td>
              <td>
                <div className="subCategoryAction">
                  <NavLink
                    className="customNavLink subCategoryButton"
                    to={`${allRoutes.addAssignment}/${category.id}`}
                    state={{
                      assignmentId: category.id,
                    }}
                  >
                    Edit
                  </NavLink>

                  <button
                    type="submit"
                    className="subCategoryButton m-1 redClr ms-3"
                    onClick={() =>
                      ConfirmPopup(category.id, handleDeleteAssignment)
                    }
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </TableRow>
    </Table>
  );
}
