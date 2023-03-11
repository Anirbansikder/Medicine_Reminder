import React , { useState } from "react";
import axios from "axios";

import "./DeleteModal.css"

const DeleteModal = ({closeModal, user}) => {
    const [error,setError] = useState("");
    const handleDelete = () => {
        axios.post("http://localhost:5000/delete-user", {phoneNumber : user.phoneNumber})
        .then(response => {
            if(response.data.message == "User Deleted"){
                setError("");
                closeModal();
            } else {
                setError(response.data.message);
            }
        })
        .catch(err => {
            setError(err);
        })
    }
    return (
        <div className="modal-container">
            <div className="modal-header">
                <h2>Delete Patient</h2>
                <button onClick={closeModal} className="modal-close-btn">
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <p className="deleteHeader">Are You Sure You Want To Delete User ?</p>
                <div className="deleteButtons">
                    <button className="danger" onClick={() => handleDelete()}>YES</button>
                    <button className="safe" onClick={closeModal}>NO</button>
                </div>
                <div className="errorTag">{error}</div>
            </div>
        </div>
    );
}

export default  DeleteModal;