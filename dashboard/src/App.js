import React from 'react';
import Dashboard from "./Dashboard/Dashboard.jsx"
import MessageDashboard from "./MessageDashboard/MessageDashboard.jsx"
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/messages" exact element={<MessageDashboard/>} />
                <Route path="/" exact element={<Dashboard/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;