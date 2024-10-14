import React, { useState } from 'react';
import axios from '../axios'; 
import CommentSection from './CommentSection.tsx';

interface Option {
  id: number;
  text: string;
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

  const handleVote = async () => {
    if (selectedOptionId === null) {
      setError('Por favor, selecione uma opção para votar.');
      return;
    }

    try {
      const voteData = {
        userId: 12, 
        optionId: selectedOptionId,
        pollId: id,
      };

      await axios.post('/api/v1/votes', voteData); 
      setSuccess('Voto enviado com sucesso!');
      setSelectedOptionId(null); 
    } catch (err) {
      console.error('Erro ao enviar voto:', err);
      setError('Ocorreu um erro ao enviar seu voto. Tente novamente.');
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div>
        {options.map(option => (
          <div key={option.id}>
            <input
              type="radio"
              id={`option-${option.id}`}
              name="pollOption"
              value={option.id}
              onChange={() => setSelectedOptionId(option.id)}
            />
            <label htmlFor={`option-${option.id}`}>{option.text}</label>
          </div>
        ))}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button onClick={handleVote}>Votar</button>

      {/* Seção de comentários */}
      <CommentSection pollId={id} />
    </div>
  );
};


export default Poll;
