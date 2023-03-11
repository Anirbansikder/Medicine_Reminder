import React, { useState } from "react";
import axios from "axios";

const EditPatientModal = ({ closeModal,user }) => {
  const [name, setName] = useState(user.name);
  const [medicines, setMedicines] = useState(user.medicines);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [error, setError] = useState("");
  const [days, setDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeMedicineName = (event) => {
    setMedicineName(event.target.value);
  };

  const handleChangeDosage = (event) => {
    setDosage(event.target.value);
  };

  const handleChangeDays = (event) => {
    const { name, checked } = event.target;
    setDays((prevDays) => ({
      ...prevDays,
      [name]: checked,
    }));
  };

  const handleAddMedicine = () => {
    let boolValue = false;
    boolValue |= days.Sunday;
    boolValue |= days.Monday;
    boolValue |= days.Tuesday;
    boolValue |= days.Wednesday;
    boolValue |= days.Thursday;
    boolValue |= days.Friday;
    boolValue |= days.Saturday;
    if(medicineName == "" || dosage == "" || boolValue == false){
        setError("Please Do Not Set Any Medicine Field Blank")
        return;
    }
    const newMedicine = {
      medicineName,
      dosage,
      days,
    };
    setMedicines([...medicines, newMedicine]);
    setMedicineName("");
    setDosage("");
    setDays({
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    });
    setError("");
  };

  const handleSubmit = () => {
    if(name == ""){
        setError("Please Provide A Valid Name")
    } else {
        const newMedicineList = medicines.map(element => {
            let dayString = "";
            if(element.days.Sunday == true) dayString +="S";
            if(element.days.Monday == true) dayString +="M";
            if(element.days.Tuesday == true) dayString +="T";
            if(element.days.Wednesday == true) dayString +="W";
            if(element.days.Thursday == true) dayString +="Th";
            if(element.days.Friday == true) dayString +="F";
            if(element.days.Saturday == true) dayString +="Sa";
            return {medicineName : element.medicineName , dosage : element.dosage , days : dayString};
        })
        axios.post("http://localhost:5000/edit-user", {name,phoneNumber:user.phoneNumber,medicines:newMedicineList})
        .then(response => {
            if(response.data.message == "Data Updated"){
                setError("")
                closeModal();
            } else {
                setError(response.data.message);
            }
        })
        .catch(err => {
            setError(err);
        })
    }
  };

  const handleDelete = (index) => {
    const newList = [...medicines];
    newList.splice(index, 1);
    setMedicines(newList);
  };

  return (
    <div className="modal-container">
      <div className="modal-header">
        <h2>Add Patient</h2>
        <button onClick={closeModal} className="modal-close-btn">
          &times;
        </button>
      </div>
      <div className="modal-body">
        <div className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleChangeName}
            />
          </div>
          <p className="medicineHeader">Medicines Added : </p>
          <div className="medicinesContainer">
            {medicines.map((element,index) => {
                let dayString = "";
                if(element.days.Sunday == true) dayString +="S";
                if(element.days.Monday == true) dayString +="M";
                if(element.days.Tuesday == true) dayString +="T";
                if(element.days.Wednesday == true) dayString +="W";
                if(element.days.Thursday == true) dayString +="Th";
                if(element.days.Friday == true) dayString +="F";
                if(element.days.Saturday == true) dayString +="Sa";
                return <div className="medicineList" key={index}><b>Name</b> : {element.medicineName} <b>Dosage</b> : {element.dosage} <b>Days</b> : {dayString} <u className="deleteButton" onClick={() => handleDelete(index)}>delete</u></div>
            })}
          </div>
          <p className="medicineHeader"><u>Add new medicines by inserting values on respective fields and click on <i>Add Medicine</i> button</u></p>
          <div className="form-group">
            <label htmlFor="medicineName">Medicine Name:</label>
            <input
              type="text"
              id="medicineName"
              value={medicineName}
              onChange={handleChangeMedicineName}
            />
          </div>
          <div className="form-group">
            <label htmlFor="dosage">Dosage:</label>
            <input
              type="text"
              id="dosage"
              value={dosage}
              onChange={handleChangeDosage}
            />
          </div>
          <div className="form-group">
            <label>Days:</label>
            <div className="days-container">
            <div>
                <label htmlFor="Sunday">Sunday</label>
                <input
                type="checkbox"
                id="Sunday"
                name="Sunday"
                checked={days.Sunday}
                onChange={handleChangeDays}
                />
            </div>
            <div>
                <label htmlFor="Monday">Monday</label>
                <input
                type="checkbox"
                id="Monday"
                name="Monday"
                checked={days.Monday}
                onChange={handleChangeDays}
                />
            </div>
            <div>
                <label htmlFor="Tuesday">Tuesday</label>
                <input
                type="checkbox"
                id="Tuesday"
                name="Tuesday"
                checked={days.Tuesday}
                onChange={handleChangeDays}
                />
            </div>
            <div>
                <label htmlFor="Wednesday">Wednesday</label>
                <input
                type="checkbox"
                id="Wednesday"
                name="Wednesday"
                checked={days.Wednesday}
                onChange={handleChangeDays}
                />
            </div>
            <div>
                <label htmlFor="Thursday">Thursday</label>
                <input
                type="checkbox"
                id="Thursday"
                name="Thursday"
                checked={days.Thursday}
                onChange={handleChangeDays}
                />
            </div>
            <div>
                <label htmlFor="Friday">Friday</label>
                <input
                type="checkbox"
                id="Friday"
                name="Friday"
                checked={days.Friday}
                onChange={handleChangeDays}
                />
            </div>
            <div>
                <label htmlFor="Saturday">Saturday</label>
                <input
                type="checkbox"
                id="Saturday"
                name="Saturday"
                checked={days.Saturday}
                onChange={handleChangeDays}
                />
            </div>
            </div>
          </div>
        </div>
        <div className="buttonList">
            <button onClick={handleAddMedicine}>Add Medicine</button>
            <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="errorTag">{error}</div>
      </div>
    </div>
  );
}

export default EditPatientModal;