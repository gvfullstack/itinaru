import React from 'react';
import styles from '../EditFormCSS/itineraryEditForm.module.css'; // Your CSS module import

interface DeleteConfirmationDialogProps {
    onCancel: () => void; // Function type for the cancel action
    onConfirm: () => void; // Function type for the confirm action
  }

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ onCancel, onConfirm }) => {
  return (
    <div className={styles.EFConfirmDeleteItinContainer}>
      <div className={styles.EFConfirmDeleteItinSection}>
          <p className={styles.confirmQ}>Are you sure you want to permanently delete this item?</p>
              <div>
                  <button className={styles.cancelButton}
                  onClick={onCancel}
                  >Cancel</button>
                  <button className={styles.deleteButton}
                  onClick={onConfirm}
                  >Yes, Delete Item</button>
              </div>        
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;