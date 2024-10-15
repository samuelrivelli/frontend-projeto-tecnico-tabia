import React, { useState } from "react";
import axios from "../axios";
import CommentSection from "./CommentSection.tsx";
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
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pollOptions, setPollOptions] = useState<Option[]>(options);
  const [isExpanded, setIsExpanded] = useState(false); 

  const handleVote = async () => {
    if (selectedOptionId === null) {
      setError("Por favor, selecione uma opção para votar.");
      return;
    }

    try {
      const voteData = {
        userId: localStorage.getItem("userId"),
        optionId: selectedOptionId,
        pollId: id,
      };

      await axios.post("/api/v1/votes", voteData);
      setPollOptions((prevOptions) =>
        prevOptions.map((option) =>
          option.id === selectedOptionId
            ? { ...option, voteCount: option.voteCount + 1 }
            : option
        )
      );
      setSuccess("Voto enviado com sucesso!");
      setSelectedOptionId(null);
    } catch (err) {
      console.error("Erro ao enviar voto:", err);
      setError("Ocorreu um erro ao enviar seu voto. Tente novamente.");
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="poll-container">
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="poll-options">
        {pollOptions.map((option) => (
          <div key={option.id} className="poll-option">
            <input
              type="radio"
              id={`option-${option.id}`}
              name="pollOption"
              value={option.id}
              onChange={() => setSelectedOptionId(option.id)}
            />
            <label htmlFor={`option-${option.id}`}>
              {option.text}
            </label>
            <span className="vote-count">({option.voteCount} votos)</span>
          </div>
        ))}
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <button onClick={handleVote}>Votar</button>
      <button className="expand-button" onClick={toggleExpand}>
        {isExpanded ? "Ocultar comentários" : "Ver comentários"}
      </button>
      {isExpanded && <CommentSection pollId={id} />}
    </div>
  );
};

export default Poll;
