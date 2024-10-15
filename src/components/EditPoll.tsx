import React, { useEffect, useState } from 'react';
import axios from '../axios'; 
import { useNavigate, useParams } from 'react-router-dom'; 

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
}

const EditPoll = () => {
  const [poll, setPoll] = useState<PollDTO | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [options, setOptions] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>(); // Obtém o ID da enquete a partir da URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`/api/v1/polls/${id}`);
        setPoll(response.data);
        setTitle(response.data.title);
        setDescription(response.data.description);
        setOptions(response.data.options);
      } catch (error) {
        console.error('Erro ao buscar a votação:', error);
        setError('Erro ao carregar a votação. Verifique se ela existe.');
      }
    };

    fetchPoll();
  }, [id]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedPoll = {
        ...poll,
        title,
        description,
        options
      };

      await axios.put(`/api/v1/polls/${id}`, updatedPoll);
      navigate('/'); // Redireciona para a página inicial após a edição
    } catch (error) {
      console.error('Erro ao atualizar a votação:', error);
      setError('Erro ao atualizar a votação. Tente novamente.');
    }
  };

  if (!poll) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Editar Votação</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descrição:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <h3>Opções:</h3>
        {options.map((option, index) => (
          <div key={option.id}>
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
};

export default EditPoll;
