import React from 'react';
import styles from './DeleteAccountModal.module.css'; // Ensure the CSS module is correctly imported
import {deleteUserAccount} from './UserProfileEditUtilityFunctions/deleteUserAccount';
import { authUserState } from '../../atoms/atoms';
import { useRecoilState } from 'recoil';

interface DeleteAccountModalProps {
    showModal: boolean;
    toggleModal: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ showModal, toggleModal }) => {
    const [authUser, setAuthUser] = useRecoilState(authUserState);

    if (!showModal) {
        return null;
    }

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            toggleModal();
        }
    };

    return (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
            <div className={styles.modalContent}>
                <button onClick={toggleModal} className={styles.closeButton} aria-label="Close">&times;</button>
                <p className={styles.modalMessage}>
                    This action cannot be reversed. Your user data and all your itineraries will be permanently deleted. It might take a few hours for us to fully process this request.
                </p>
                <div className={styles.modalActions}>
                    <button onClick={() => {
                        // handle delete account logic
                        deleteUserAccount(authUser?.uid ?? "");
                        toggleModal();
                    }} className={styles.confirmDeleteButton}>
                        Confirm Delete
                    </button>
                    <button onClick={() => {
                        toggleModal();
                    }} className={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteAccountModal;
