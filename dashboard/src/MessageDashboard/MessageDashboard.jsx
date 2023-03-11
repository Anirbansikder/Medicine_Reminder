import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MessageDashboard.css";
import SearchBar from "../SearchBar/searchBar";
import MessageModal from "../Modals/MessageModal/MessageModal";

const MessagingDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [totalMessages,setTotalMessages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage,setMessagesPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [modalContent, setModalContent] = useState(false);
  const [choosenUser,setChoosenUser] = useState(null);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalMessages / messagesPerPage); i++) {
    pageNumbers.push(i);
  }

  const fetchMessages = () => {
    axios.get(`http://localhost:5000/getAllMessages?limit=${messagesPerPage}&pages=${currentPage}`)
    .then(response => {
        if(response.data.message == "Retrieved Data"){
            setTotalMessages(response.data.totalLength);
            setMessages(response.data.arrayList);
            setSearchText("");
        }
    })
    .catch(err => {
        console.log(err);
    })
};

  const openModal = (index) => {
    setModalContent(true);
    setChoosenUser(index);
  };

  const closeModal = () => {
    setModalContent(false);
    fetchMessages();
  }

  const handleDelete = (index) => {
    axios.post("http://localhost:5000/deleteMessage",{MessageSid : messages[index].MessageSid})
    .then(response => {
      if(response.data.message == "Message Deleted"){
        fetchMessages();
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const handleSearchMessages = (event) => {
    event.preventDefault();
    const encodedPhoneNumber = encodeURIComponent(searchText);
    axios.get(`http://localhost:5000/getMessageByPhone?phoneNumber=${encodedPhoneNumber}&limit=${messagesPerPage}&pages=${currentPage}`)
    .then(response => {
        if(response.data.message == "Retrieved Data"){
            setTotalMessages(response.data.totalLength);
            setMessages(response.data.arrayList);
            setCurrentPage(1);
            if(searchText != ""){
                setMessagesPerPage(response.data.totalLength);
            } else {
                setMessagesPerPage(10);
            }
            setSearchText("")
        }
    })
    .catch(err => {
        console.log(err);
    })
  }

  return (
    <div className="dashboard-container">
        <h1 className="message-header">Message Dashboard</h1>
        <div className="dashboard-top-message">
            <div className="dashboard-searchbar-container">
                <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                <button onClick={handleSearchMessages}>Search</button>
            </div>
        </div>
      <div className="row mt-4">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>MessageSid</th>
                <th>SmsSid</th>
                <th>AccountSid</th>
                <th>MessagingServiceSid</th>
                <th>From</th>
                <th>To</th>
                <th>Body</th>
                <th>Timestamp</th>
                <th>Delete Message</th>
                <th>Send Message</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message, index) => (
                <tr key={message.MessageSid}>
                  <td>{message.MessageSid}</td>
                  <td>{message.SmsSid}</td>
                  <td>{message.AccountSid}</td>
                  <td>{message.MessagingServiceSid}</td>
                  <td>{message.From}</td>
                  <td>{message.To}</td>
                  <td>{message.Body}</td>
                  <td>{message.timeStamp}</td>
                  <td style={{color : "red" , cursor : "pointer"}} onClick={() => handleDelete(index)}>delete message</td>
                  <td style={{color : "green" , cursor : "pointer"}} onClick={() => openModal(index)}>send message</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="pagination-container">
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {modalContent && <MessageModal closeModal={closeModal} user={messages[choosenUser]}/>}
    </div>
  );
};

export default MessagingDashboard;
