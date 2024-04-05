import { useState } from "react";
import openEye from "../../assets/img/eyeOpenIcon.png";
import closeEye from "../../assets/img/eyeHideIcon.png";
import "./changePassword.scss";

export default function PasswordField({
  errors,
  touched,
  label,
  onChange,
  name,
  value,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="changePasswordInput">
      <label htmlFor="type">{label}</label>
      <div className="changePassword">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          onChange={onChange}
          value={value}
          // onBlur={handleValidation}
          className="form-control"
          aria-label="First name"
        />
        <button
          className="viewToggleBtn"
          type="button"
          onClick={handleToggleClick}
        >
          {showPassword ? (
            <img src={openEye} alt="" />
          ) : (
            <img src={closeEye} alt="" />
          )}
        </button>
      </div>

      {errors && touched ? <div className="ErrorsMsg">{errors}</div> : null}
    </div>
  );
}
