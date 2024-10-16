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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          <Route path="/user-polls" element={<UserPolls />} />
          <Route path="/edit-poll/:id" element={<EditPoll />} />
          <Route path="/poll/:id/comments" element={<PollDetail />} />
          {/* add as rotas privadas */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
