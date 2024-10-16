import React from "react";
import { useNavigate } from "react-router-dom";
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
}

const Poll: React.FC<PollProps> = ({ id, title, description, options }) => {
 
  const navigate = useNavigate();

  const navigateToComments = () => {
    navigate(`/poll/${id}/comments`); 
  };

  return (
    <div className="poll-card">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={navigateToComments}>
        Ver Enquete
      </button>
    </div>
  );
};

export default Poll;
