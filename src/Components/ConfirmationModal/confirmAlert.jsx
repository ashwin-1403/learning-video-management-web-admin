import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./confirmAlert.scss";

export const ConfirmPopup = (
  key,
  deleteCallback,
  cancelCallback
) => {
  confirmAlert({
    title: 'Confirm to submit',
    message: 'Are you sure?',
    buttons: [
      {
        label: 'Yes',
        onClick: () => deleteCallback(key),
      },
      {
        label: 'No',
        onClick: () => cancelCallback && cancelCallback(),
      },
    ],
  });
};
