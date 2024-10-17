import React, { useState } from "react";
import axios from "../axios"; 
import "../css/Register.css"; 
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      const response = await axios.post("auth/register/user", { username, password });
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login"); 
        }, 1500);
      }
    } catch (error) {
      setError("Erro ao registrar o usuário. Tente novamente.");
      console.error("Erro no registro:", error);
    }
  };

  return (
    <div className="register-container">
      <h1>Registrar Usuário</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Usuário registrado com sucesso!</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Registrar</button>
      </form>
    </div>
  );
};

export default Register;
