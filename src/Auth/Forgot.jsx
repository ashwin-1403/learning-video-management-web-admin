import { NavLink, useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
// import DeliveryImg from "../assets/img/deliveryImg.png";
import "./Login.scss";
import ButtonSubmitField from "../Components/ButtonSubmitField";
import PostApi from "../services/PostApi";
import { ToastFailure, ToastSuccess } from "../Utils/Toast/ToastMsg";
import { ForgotSchema } from "./schema";
import { allRoutes } from "../routes/path";

function Forgot() {
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      const res = await PostApi("auth/forget-pass", {
        email: values?.email,
      });
      if (res?.status === 200) {
        localStorage.setItem("email", values?.email);
        ToastSuccess(res?.message);
        navigate("/otpvalidate");
      }
    } catch (error) {
      ToastFailure(error);
    }
  };

  return (
    <div className="aspectHeight">
      <div className="logInPage forgotPage">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="loginFormSection">
                <div className="loginFormSec">
                  <h1 className="loginHeading">Forgot password</h1>
                  <p>Please enter your email address to reset your password.</p>
                  <div className="inputFeilds">
                    <Formik
                      initialValues={{
                        email: "",
                      }}
                      validationSchema={ForgotSchema}
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      {({ errors, touched, handleChange, values }) => (
                        <Form>
                          <div className="mb-3">
                            <label
                              htmlFor="exampleInputEmail1"
                              className="form-label"
                            >
                              Email Address
                            </label>
                            <input
                              type="text"
                              name="email"
                              onChange={handleChange}
                              value={values?.email}
                              className="form-control"
                              id="exampleInputEmail1"
                              aria-describedby="emailHelp"
                            />
                            {errors.email && touched.email ? (
                              <div className="LoginMsgs">{errors.email}</div>
                            ) : null}
                          </div>
                          <ButtonSubmitField name="Submit" />

                          <div className="backToLoginBtn">
                            <NavLink
                              className="textDecorationNone"
                              to={allRoutes.login}
                            >
                              <h6>Back to login</h6>
                            </NavLink>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Forgot;
