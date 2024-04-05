import "../details.scss";

function InputFiedWithLabel({
  errors,
  touched,
  label,
  name,
  onChange,
  value,
  placeholder,
  disable,
  classnames,
  labelInputClass,
  type,
  maxLength,
}) {
  return (
    <div className={`col-sm-12 ${classnames || "col-md-6"}`}>
      <div className="groupInfo">
        <label className={labelInputClass} htmlFor="type">
          {label}
        </label>
        <input
          type={type}
          name={name}
          value={value}
          disabled={disable}
          onChange={onChange}
          className="form-control employeInfoInput"
          placeholder={placeholder}
          aria-label="First name"
          maxLength={maxLength}
        />
      </div>
      {errors && touched ? (
        <div className="text-danger">
          {errors}
        </div>
      ) : null}
    </div>
  );
}

export default InputFiedWithLabel;
