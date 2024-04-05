import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./video.scss";
import Video from "../../assets/img/Video.png";

export default function VideoPlay({ videoURL }) {
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <button className="videoButton" onClick={() => setShowModal(true)}>
        <img src={Video} alt="Thumbnail" />
      </button>

      {showModal && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Video Player</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center">
              <iframe
                width="450"
                height="300"
                src={`https://www.youtube.com/embed/${videoURL}`}
                frameborder="0"
                allowfullscreen
                title="Video"
              ></iframe>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
