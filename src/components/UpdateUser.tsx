import React, { useState, useEffect } from "react";
import axios from "../axios"; 
import { useNavigate, useParams } from "react-router-dom";
import "../css/UpdateUser.css";

const UpdateUser = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
        setRole(response.data.role);
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setError('Erro ao carregar os dados do usuário.');
      }
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/auth/update/${id}`, {
        username,
        role,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        <button type="submit" className="update-button">Salvar</button>
        <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
      </form>
    </div>
  );
};

export default UpdateUser;
