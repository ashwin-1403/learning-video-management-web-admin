import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";

import PostApi from "../../services/PostApi";

import { ToastFailure, ToastSuccess } from "../../Utils/Toast/ToastMsg";
import { UserSchema } from "../../Auth/schema";
import InputFiedWithLabel from "../../Components/InputFiedWithLabel";
import back from "../../assets/img/back.png";
import GetApi from "../../services/GetApi";

import PutApi from "../../services/PutApi";
import { allRoutes } from "../../routes/path";
import Loader from "../../Utils/Loader/Loader";

function AddStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    categoryID: "",
  });

  // Function to fetch student details
  const fetchStudentDetails = async (category) => {
    if (studentId) {
      try {
        const response = await GetApi(`api/user/get/byId/${studentId}`);

        if (response.statusCode >= 200 && response.statusCode < 300) {
          const { firstName, lastName, email, mobile, categoryID } =
            response?.data?.user;

          const categoryAssociate = response?.data?.category;

          const categoryList = [...category];

          const index = categoryList.findIndex((e) => {
            return categoryID === e.id;
          });

          if (index > -1) {
            categoryList.splice(index, 1);
          }

          categoryList.push({
            id: categoryAssociate.id,
            categoryName: categoryAssociate.categoryName,
          });

          setCategories(categoryList);
          setInitialValues({
            firstName,
            lastName,
            email,
            mobile,
            categoryID: categoryID,
          });
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };

  // Function to add student details
  const addStudentDetail = async (values) => {
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      categoryID: values.categoryID,
    };
    setLoading(true);
    try {
      const res = await PostApi("api/user/add", data);
      if (res?.data?.statusCode >= 200 && res?.data?.statusCode < 300) {
        ToastSuccess(res?.data?.message);
        setLoading(false);
        handleBackButton();
      } else {
        setLoading(false);
        ToastFailure(res?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  };

  // Function to update student details
  const updateStudentDetails = async (values) => {
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobile: values.mobile,
      categoryID: values.categoryID,
    };
    setLoading(true);
    try {
      const response = await PutApi(
        `api/user/update/profile/${studentId}`,
        data
      );
      if (
        response?.data?.statusCode >= 200 &&
        response?.data?.statusCode < 300
      ) {
        ToastSuccess(response?.data?.message);
        setLoading(false);
        handleBackButton();
      } else {
        setLoading(false);
        ToastFailure(response?.data?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error: ", error);
    }
  };

  async function getVideoCategory() {
    try {
      let params = {
        isActive: true,
      };

      const response = await GetApi("api/category/get", params);

      if (response?.statusCode >= 200 && response?.statusCode < 300) {
        const category = response.data.rows.map((e) => {
          return {
            id: e.id,
            categoryName: e.categoryName,
          };
        });
        
        if (studentId) {
          fetchStudentDetails(category);
        }else {
          setCategories(category);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  }

  useEffect(() => {
    getVideoCategory();
  }, []);

  const handleBackButton = () => {
    navigate(allRoutes.student);
  };

  const submitHandler = (values) => {
    if (studentId) {
      updateStudentDetails(values);
    } else {
      addStudentDetail(values);
    }
  };

  return (
    <div className="addEmployeeSection">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="d-flex gap-4">
              <button
                type="button"
                className="backButton"
                onClick={handleBackButton}
              >
                <img src={back} alt="Description" className="" />
              </button>
              <div className="addEmployeeHeader">
                <div className="d-flex align-items-center employeeheading">
                  {studentId ? <h2>Edit Student</h2> : <h2>Add Student</h2>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <Formik
            initialValues={initialValues}
            validationSchema={UserSchema}
            enableReinitialize={true}
            onSubmit={(values) => {
              submitHandler(values);
            }}
          >
            {({ errors, touched, handleChange, values }) => (
              <Form>
                <div className="col-md-12 col-lg-8  mx-auto">
                  <div className="profileInfoSec">
                    <div className="addStudentHeading">
                      <h5>
                        <div>Student Information </div>
                      </h5>
                    </div>
                    <div className="d-flex row">
                      <div className="videoCategoryContainer">
                        <select
                          id="categorySelect"
                          name="categoryID"
                          value={values?.categoryID}
                          onChange={handleChange}
                          className="form-select selectBox selectCategory "
                        >
                          <option value="" disabled>
                            Select category
                          </option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.categoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors?.categoryID && touched?.categoryID && (
                        <div className="text-danger">{errors?.categoryID}</div>
                      )}

                      <InputFiedWithLabel
                        errors={errors?.firstName}
                        touched={touched?.firstName}
                        type="text"
                        label="First Name"
                        name="firstName"
                        onChange={handleChange}
                        value={values?.firstName}
                        maxLength={50}
                      />

                      <InputFiedWithLabel
                        errors={errors?.lastName}
                        touched={touched?.lastName}
                        type="text"
                        label="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        value={values?.lastName}
                        maxLength={50}
                      />
                      <InputFiedWithLabel
                        errors={errors?.email}
                        touched={touched?.email}
                        type="text"
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        value={values?.email}
                        maxLength={50}
                        disable={studentId ? true : false}
                      />

                      <InputFiedWithLabel
                        type="tel"
                        label="Mobile No."
                        name="mobile"
                        errors={errors?.mobile}
                        touched={touched?.mobile}
                        onChange={handleChange}
                        value={values?.mobile}
                        maxLength={50}
                      />
                    </div>
                    <div className="addStudentHeading"></div>
                  </div>

                  <div className="profileInfoSubmit">
                    <button type="submit">
                      {studentId ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      {loading && <Loader startLoading={loading} />}
    </div>
  );
}

export default AddStudent;
