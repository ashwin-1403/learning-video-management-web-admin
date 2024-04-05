import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is mandatory.")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
  password: Yup.string()
    .required("Password is mandatory.")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
});

export const UserSchema = Yup.object().shape({
  categoryID : Yup.string().required("Category is manadatory"),
  firstName: Yup.string().required("First Name is mandatory."),
  lastName: Yup.string().required("Last Name is mandatory."),
  email: Yup.string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email.")
    .required("Email is mandatory.")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
  mobile: Yup.string()
    .required("Mobile number is mandatory.")
    .matches(/^[0-9]+$/, "Mobile number must contain only digits")
    .min(10, "Mobile number must be at least 10 digits")
    .max(10, "Mobile number cannot exceed 10 digits"),
});

export const ForgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email.")
    .required("Email is mandatory."),
});

export const ResetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Please enter a new password")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .matches(/[0-9]/, "At least one Digit")
    .matches(/[a-z]/, "At least one Lowercase")
    .matches(/[A-Z]/, "At least one Uppercase")
    .matches(/(?=.*?[#?!@$%^&*-])/, "At least one Special Characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),

  confirmPassword: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("newPassword")], "Passwords does not match")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
});

export const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required("Please enter a old password")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
  newPassword: Yup.string()
    .required("Please enter a new password")
    .min(6, "Password must contain minimum 6 characters")
    .max(32, "Password must contain maximum 32 characters")
    .matches(/[0-9]/, "At least one Digit")
    .matches(/[a-z]/, "At least one Lowercase")
    .matches(/[A-Z]/, "At least one Uppercase")
    .matches(/(?=.*?[#?!@$%^&*-])/, "At least one Special Characters")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),

  confirmPassword: Yup.string()
    .required("Please re-type your password")
    .oneOf([Yup.ref("newPassword")], "Passwords does not match")
    .test(
      "conditional-validation",
      "No leading or trailing spaces are allowed",
      (value) => value === undefined || value.trim() === value,
    ),
});

export function formatTime(inputDate) {
  const date = new Date(inputDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = (hours % 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes} ${period}`;
}

export function formatDate(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function formatDateForFilter(inputDate) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}

export function getCurrentDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
}
