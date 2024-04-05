import ClipLoader from "react-spinners/ClipLoader";
import "./Loader.style.scss";

function Loader({ startLoading }) {
  return (
    <div className={`loader-overlay ${startLoading ? "active" : ""}`}>
      <div className="loader-div">
        {startLoading && <ClipLoader color="white" size={45} />}
      </div>
    </div>
  );
}

export default Loader;
