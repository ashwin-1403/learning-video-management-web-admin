import "./Date.scss";
import calenderIcon from "../../assets/img/calnderIcon.png";

function Date(props) {
  return (
    <div className="StartDate">
      <div className="selectIcondiv">
        {props?.label && (
          <label className="startDateLabel">{props?.label}</label>
        )}
      </div>
      <img className="calenderImg" src={calenderIcon} alt="" />
      {props?.children}
    </div>
  );
}

export default Date;
