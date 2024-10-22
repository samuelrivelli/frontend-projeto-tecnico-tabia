import React, { useState } from "react";
import axios from "../axios"; 
import "../css/Register.css"; 


const RegisterAdmin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      if (password !== confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }
      
      try {
        
        await axios.post('/auth/register/admin', {
          username,
          password
        });
  
        setSuccess('Administrador cadastrado com sucesso!');
        setError('');
        
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.error('Erro ao cadastrar admin:', error);
        setError('Erro ao cadastrar administrador. Verifique os dados e tente novamente.');
        setSuccess('');
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

export default RegisterAdmin;
