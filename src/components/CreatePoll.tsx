import React, { useState } from 'react';
import axios from '../axios'; 
import { useNavigate } from 'react-router-dom';

const CreatePoll = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([{ text: '', voteCount: 0 }]); 
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, { text: '', voteCount: 0 }]);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    const pollData = {
      title,
      description,
      userId: localStorage.getItem('userId'), 
      options: options.map((option) => ({
        text: option.text,
        voteCount: option.voteCount,
      })),
    };

    try {
      await axios.post('/api/v1/polls', pollData);
     
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar a enquete:', error);
     
    }
  };

  return (
    <div>
      <h1>Criar Nova Poll</h1>
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
        <h2>Opções:</h2>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
            <button type="button" onClick={() => handleRemoveOption(index)}>Remover</button>
          </div>
        ))}
        <button type="button" onClick={handleAddOption}>Adicionar Opção</button>
        <button type="submit">Criar Poll</button>
      </form>
    </div>
  );
};

export default CreatePoll;
