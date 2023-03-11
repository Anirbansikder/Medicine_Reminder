import React , { useState } from "react";
import axios from "axios";

const PhoneModal = ({closeModal, user}) => {
    const oldNum = user.phoneNumber;
    const [error,setError] = useState("");
    const [phoneNumberNow,setPhoneNumber] = useState(user.phoneNumber);
    const handleChangePhoneNumber = () => {
        axios.post("http://localhost:5000/edit-phono", {newPhoneNum : phoneNumberNow , oldNum : oldNum})
        .then(response => {
            if(response.data.message == "Phone Number Updated"){
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
                <h2>Change Phone Number</h2>
                <button onClick={closeModal} className="modal-close-btn">
                    &times;
                </button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number:</label>
                    <input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumberNow}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="deleteButtonsPhone">
                    <button className="dangerPhone" onClick={() => handleChangePhoneNumber()}>Change Phone Number</button>
                </div>
                <div className="errorTag">{error}</div>
            </div>
        </div>
    );
}

export default  PhoneModal;