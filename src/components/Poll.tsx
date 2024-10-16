import React, { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

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
  const navigate = useNavigate();

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
