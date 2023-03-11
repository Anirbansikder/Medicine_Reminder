import React , { useState } from "react";
import axios from "axios";

const MessageModal = ({closeModal, user}) => {
    const [error,setError] = useState("");
    const [message,setMessage] = useState("");
    const handleSendMessage = () => {
        axios.post("http://localhost:5000/sendMessage", {number : user.From , message : message})
        .then(response => {
            if(response.data.message == "Message Sent"){
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
                    <label htmlFor="phoneNumber">Message</label>
                    <input
                    type="text"
                    id="phoneNumber"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="deleteButtonsPhone">
                    <button className="dangerPhone" onClick={() => handleSendMessage()}>Send Message</button>
                </div>
                <div className="errorTag">{error}</div>
            </div>
        </div>
    );
}

export default  MessageModal;