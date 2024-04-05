import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.scss";
import ButtonSubmitField from "../Components/ButtonSubmitField";
import PostApi from "../services/PostApi";
import { ToastSuccess, ToastFailure } from "../Utils/Toast/ToastMsg";
import { LoginSchema } from "./schema";
import PasswordField from "../pages/ChangePassword/PasswordField";
import Loader from "../Utils/Loader/Loader";
import { allRoutes } from "../routes/path";

export function Login({ setIsUser }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await PostApi("api/auth/signIn", {
        email: values?.email,
        password: values?.password,
      });

      if (res?.data?.statusCode >= 200 && res?.data?.statusCode < 300) {
        setLoading(false);
        setIsUser(true);
        localStorage.setItem("isLogin", true);
        localStorage.setItem("token", res?.data?.data.token);
        ToastSuccess(res?.data?.message);
        navigate(allRoutes.category);
      } else {
        setLoading(false);
        ToastFailure(res?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ",error);
    }
  };

  return (
    <div className="aspectHeight">
      <div className="logInPage">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="loginFormSection">
                <div className="loginFormSec">
                  <h2 className="welcomeHeading">Login</h2>
                  <div className="inputFeilds">
                    <Formik
                      initialValues={{
                        email: "",
                        password: "",
                      }}
                      validationSchema={LoginSchema}
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
                          <PasswordField
                            errors={errors?.password}
                            touched={touched?.password}
                            value={values?.password}
                            label="Password"
                            onChange={handleChange}
                            name="password"
                          />
                          {/* <div className="mb-3 form-check">
                            <div className="forgotSec">
                              <div>
                                <NavLink
                                  className="textDecorationNone"
                                  to={allRoutes.forgotPassword}
                                >
                                  <p>Forgot password?</p>
                                </NavLink>
                              </div>
                            </div>
                          </div> */}
                          <ButtonSubmitField name="Login" />
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
      {loading && <Loader startLoading={loading} />}
    </div>
  );
}

export default Login;
