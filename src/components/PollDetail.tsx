import React, { useEffect, useState } from "react";
import axios from "../axios"; 
import CommentSection from "./CommentSection.tsx";
import { useParams, useNavigate } from "react-router-dom";
import "../css/PollDetail.css";

interface Option {
  id: number;
  text: string;
  voteCount: number;
}

interface PollDTO {
  id: number;
  title: string;
  description: string;
  options: Option[];
  isOpen: boolean; 
}

const PollDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<PollDTO | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`/api/v1/polls/${id}`);
        console.log("Resposta da API:", response.data); 
        setPoll({ ...response.data }); 
      } catch (error) {
        console.error("Erro ao buscar votação:", error);
        navigate('/');
      }
    };

    fetchPoll();
  }, [id, navigate]);

  const handleVote = async () => {
    if (!poll || !poll.isOpen) { 
      alert("A enquete está fechada. Você não pode votar.");
      return;
    }

    if (selectedOptionId === null) {
      alert("Por favor, selecione uma opção para votar.");
      return;
    }

    try {
      const voteData = {
        userId: localStorage.getItem("userId"),
        optionId: selectedOptionId,
        pollId: poll?.id,
      };

      await axios.post('/api/v1/votes', voteData);
      
      setPoll((prevPoll) => {
        if (!prevPoll) return null;
        return {
          ...prevPoll,
          options: prevPoll.options.map((option) =>
            option.id === selectedOptionId
              ? { ...option, voteCount: option.voteCount + 1 }
              : option
          ),
        };
      });

      // Limpar a seleção após votar
      setSelectedOptionId(null);
      alert("Voto enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar voto:", error);
      alert("Ocorreu um erro ao enviar seu voto. Tente novamente.");
    }
  };

  if (!poll) return <p>Carregando...</p>;

  return (
    <div className="poll-detail-container">
      <div className="poll-content">
        <h2>{poll.title}</h2>
        <p>{poll.description}</p>
        <div className="poll-options">
          {poll.options.map((option) => (
            <div key={option.id}>
              <input
                type="radio"
                id={`option-${option.id}`}
                name="pollOption"
                value={option.id}
                checked={selectedOptionId === option.id} // Ligado ao estado selectedOptionId
                onChange={() => setSelectedOptionId(option.id)}
                disabled={!poll.isOpen} 
              />
              <label htmlFor={`option-${option.id}`}>{option.text}</label>
              <span>({option.voteCount} votos)</span>
            </div>
          ))}
        </div>

        {poll.isOpen ? (
          <button onClick={handleVote}>Votar</button>
        ) : (
          <p>A enquete está fechada. Você não pode mais votar.</p>
        )}
      </div>
      
      <div className="comment-section">
        {poll.isOpen ? (
          <CommentSection pollId={poll.id} />
        ) : (
          <p>A enquete está fechada. Você não pode mais comentar.</p>
        )}
      </div>
    </div>
  );
};

export default PollDetail;
