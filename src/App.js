import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./components/Login.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Logout from "./components/Logout.tsx";
import CreatePoll from "./components/CreatePoll.tsx";
import UserPolls from "./components/UserPolls.tsx";
import EditPoll from "./components/EditPoll.tsx";
import PollDetail from "./components/PollDetail.tsx";
import Register from "./components/Register.tsx";
import RegisterAdmin from "./components/RegisterAdmin.tsx";
import UserManagement from "./components/UserManagement.tsx"; 
import UpdateUser from "./components/UpdateUser.tsx"; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/user-polls" element={<UserPolls />} />
          <Route path="/edit-poll/:id" element={<EditPoll />} />
          <Route path="/poll/:id/comments" element={<PollDetail />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
