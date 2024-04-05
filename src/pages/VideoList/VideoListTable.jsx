import { NavLink } from "react-router-dom";
import Table from "../table/Table";
import TableRow from "../table/TableRow";
import "./videoList.scss";
import Loader from "../../Utils/Loader/Loader";
import DataNotAvailable from "../../Components/DataNotFound/DataNotAvailable";
import TableCol from "../table/TableCol";
import { allRoutes } from "../../routes/path";
import VideoPlay from "./VideoPlay";
import { ConfirmPopup } from "../../Components/ConfirmationModal/confirmAlert";

function VideoListTable(props) {
  const {
    loading,
    getSerialNumber,
    currentPage,
    currentTableData,
    handleDeleteVideo,
  } = props;

  if (currentTableData?.length === 0) {
    return loading ? <Loader startLoading={loading} /> : <DataNotAvailable />;
  }
  const videoData = {
    videoID: 1,
  };

  return (
    <div>
      <Table className="tableStationWidth">
        <TableCol>
          <th>S.No.</th>
          <th> Name </th>
          <th>Description</th>
          <th>Thumbnail</th>
          <th>Play Video</th>
          <th>Action</th>
        </TableCol>
        <TableRow>
          {currentTableData?.length === 0 ? (
            <p>Data Not Found !</p>
          ) : (
            currentTableData?.map((ele, ind) => (
              <tr key={ele.id}>
                <td>{getSerialNumber(currentPage, ind)}</td>
                <td>{ele.fileName}</td>
                <td>{ele.description}</td>
                <td>
                  {ele.thumbnail ? (
                    <img
                      src={ele.thumbnail}
                      alt="Thumbnail"
                      width="50"
                      height="50"
                    />
                  ) : (
                    ""
                  )}
                </td>
                <td>
                  <VideoPlay videoURL={ele.videoURL} />
                </td>
                <td>
                  <NavLink
                    className="customNavLink subCategoryButton"
                    to={`${allRoutes.addVideo}/${ele.id}`}
                    state={videoData}
                  >
                    Edit
                  </NavLink>

                  <button
                    type="button"
                    onClick={() => ConfirmPopup(ele.id, handleDeleteVideo)}
                    aria-label="Delete video"
                    className="subCategoryButton m-1 redClr ms-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </TableRow>
      </Table>
    </div>
  );
}
export default VideoListTable;
