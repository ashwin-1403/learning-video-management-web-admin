function ButtonSubmitField({ name }) {
  return (
    <div className="loginBtnSec">
      <button type="submit" className="loginBtn">
        {name}
      </button>
    </div>
  );
}

export default ButtonSubmitField;
