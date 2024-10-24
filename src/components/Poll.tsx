import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios"; 
import "../css/Poll.css";

interface Option {
  id: number;
  text: string;
  voteCount: number;
}

interface PollProps {
  id: number;
  title: string;
  description: string;
  options: Option[];
  onDelete: (pollId: number) => void; 
}

const Poll: React.FC<PollProps> = ({ id, title, description, options, onDelete }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role'); 

  const navigateToComments = () => {
    navigate(`/poll/${id}/comments`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/polls/${id}`);
      alert("Enquete deletada com sucesso!");
      onDelete(id); 
    } catch (error) {
      console.error("Erro ao deletar a enquete:", error);
      alert("Erro ao deletar a enquete.");
    }
  };

  return (
    <div className="poll-card">
      <h2>{title}</h2>
      <p>{description}</p>
      
      <div className="button-container">
        <button onClick={navigateToComments}>
          Ver Enquete
        </button>

        {userRole === "ADMIN" && (
          <button onClick={handleDelete} className="delete-poll-button">
            Deletar Enquete
          </button>
        )}
      </div>
    </div>
  );
};

export default Poll;
