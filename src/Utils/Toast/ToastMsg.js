import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ToastSuccess = (msg) => {
  toast.success(msg, {
    hideProgressBar: true,
    autoClose: 2000,
  });
};

export const ToastFailure = (msg) => {
  toast.error(msg, {
    hideProgressBar: true,
    autoClose: 2000,
  });
};
