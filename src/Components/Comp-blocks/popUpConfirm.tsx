import React from "react";
import Styles from "../../Sass/PopUpDelete.module.scss";

interface Props {
  onClose: () => void;
  onDelete: () => void;
}

const PopUpConfirm: React.FC<Props> = ({ onClose, onDelete }) => {
  const handleDeleteClick = () => {
    onDelete();
    onClose();
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.container__content}>
        <h1>Delete Message</h1>
        <p>Are you sure you want to delete this message?</p>
        <div className={Styles.buttonGroup}>
          <button onClick={() => onClose()} className={Styles.cancel}>
            Cancel
          </button>
          <button onClick={handleDeleteClick} className={Styles.delete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpConfirm;
