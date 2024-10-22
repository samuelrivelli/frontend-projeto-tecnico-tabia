import React, { useState, useEffect } from "react";
import axios from "../axios"; 
import { useNavigate, useParams } from "react-router-dom";
import "../css/UpdateUser.css";

const UpdateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [originalUsername, setOriginalUsername] = useState('');
  const [originalPassword, setOriginalPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`)
        setUsername(response.data.username);
        setPassword(response.data.password);
        setOriginalUsername(response.data.username); 
        setOriginalPassword(response.data.password);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setError('Erro ao carregar os dados do usuário.');
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword && password) {
      setError("As senhas não coincidem");
      return;
    }

  
    const updatedData: { username?: string; password?: string; role?: string } = {};

    if (username !== originalUsername) {
      updatedData.username = username;
    }
    if (password && password !== originalPassword) {
      updatedData.password = password;
    }

    if (Object.keys(updatedData).length === 0) {
      setError('Nenhuma alteração foi feita.');
      return;
    }

    try {
      await axios.put(`/auth/update/${id}`, updatedData);
      setSuccess('Usuário atualizado com sucesso!');
      window.alert('Usuário atualizado com sucesso!');
      setError('');

      navigate('/user-management');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      setError('Erro ao atualizar os dados do usuário.');
      setSuccess('');
    }
  };

  const handleCancel = () => {
    navigate("/");
  };
  
  return (
    <div className="update-user-container">
      <h1>Atualizar Usuário</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="update-user-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
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
            placeholder="Deixe em branco para não alterar"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Deixe em branco para não alterar"
          />
        </div>
        <button type="submit" className="update-button">Salvar</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;
