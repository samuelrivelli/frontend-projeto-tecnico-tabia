import React, { useEffect, useState } from "react";
import axios from "../axios"; 
import { useNavigate } from "react-router-dom";
import "../css/UserManagement.css"; // Arquivo CSS para estilização

interface User {
  id: number;
  username: string;
  role: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    // Se não for admin, redireciona para a página inicial
    if (!token || role !== "ADMIN") {
      navigate('/');
      return;
    }

    // Fetch users from the server
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/v1/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError("Erro ao carregar os usuários.");
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleDelete = async (userId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess("Usuário deletado com sucesso!");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      setError("Erro ao deletar o usuário.");
    }
  };

  const handleUpdate = (userId: number) => {
    navigate(`/update-user/${userId}`);
  };

  return (
    <div className="user-management-container">
      <h1>Gerenciamento de Usuários</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleUpdate(user.id)} className="update-button">Atualizar</button>
                <button onClick={() => handleDelete(user.id)} className="delete-button">Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
