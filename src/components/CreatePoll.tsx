import React, { useState } from 'react';
import axios from '../axios'; 
import { useNavigate } from 'react-router-dom';
import "../css/EditPoll.css";

const CreatePoll = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState([{ text: '', voteCount: 0 }]); 
  const [errorMessage, setErrorMessage] = useState('')
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

  const handleCancel = () => {
    navigate("/");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setErrorMessage('');

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

      const token = localStorage.getItem('token'); 
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post('/api/v1/polls', pollData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      navigate('/');
    } catch (error) {
      console.error('Erro ao criar a enquete:', error);
      setErrorMessage('Erro ao criar a enquete. Tente novamente.')
    }
  };

  return (
    <div className="container"> 
      <h1>Criar Nova Poll</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
          <div key={index} className="option-container">
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
            <button 
              type="button" 
              className="remove-button" 
              onClick={() => handleRemoveOption(index)}
            >
              Remover
            </button>
          </div>
        ))}
        <div className="button-container">
          <button 
            type="button" 
            className="add-button" 
            onClick={handleAddOption}
          >
            Adicionar Opção
          </button>
          <button type="submit" className="save-button">
            Criar Poll
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default CreatePoll;