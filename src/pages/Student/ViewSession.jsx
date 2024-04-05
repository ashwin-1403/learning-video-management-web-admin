
import { Modal} from "react-bootstrap";
import "./student.scss";

function ViewSession({ showModal, studentData, handleClose }) {
  return (
    <>
      <Modal className="modelViewSession" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modelHeading">
            View Student Session
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="text-secondary ">
              <b>Student Name</b>
              <span className="text-secondary">
                : {studentData.firstName}&nbsp;{studentData.lastName}
              </span>
            </div>
            <div className="text-secondary">
              <b>Device Id</b>
              <span className="text-secondary">
                : {studentData?.DeviceTokens && studentData?.DeviceTokens.length > 0 ? studentData?.DeviceTokens[0].deviceId : "NA"}
              </span>
            </div>
            <div className="text-secondary ">
              <b>Status</b>
              <span className="text-secondary">
                : {studentData?.DeviceTokens && studentData?.DeviceTokens.length > 0 ? (studentData?.DeviceTokens[0].isActive ? 'Active' : 'Inactive') : "NA"}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex mt-2 ">
            <button className="modelButton m-1" onClick={handleClose}>
              Close
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ViewSession;
