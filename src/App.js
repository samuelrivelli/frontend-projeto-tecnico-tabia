import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./components/Login.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Logout from "./components/Logout.tsx";
import CreatePoll from "./components/CreatePoll.tsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-poll" element={<CreatePoll />} />
          {/* Adicione outras rotas privadas aqui */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
