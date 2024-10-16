import React, { useEffect, useState } from 'react';
import axios from '../axios'; 
import {useNavigate } from 'react-router-dom'; 
import '../css/Home.css'; 

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
  userId: number; 
}

const UserPolls = () => {
  const [polls, setPolls] = useState<PollDTO[]>([]); 

  const navigate = useNavigate(); 

  const handleButtonClick = (pollId: number) => {
    navigate(`/edit-poll/${pollId}`); 
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUserPolls = async () => {
      try {
        const response = await axios.get('/api/v1/polls', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userId = localStorage.getItem('userId'); 
        const userPolls = response.data.filter((poll: PollDTO) => poll.userId === Number(userId)); 
        setPolls(userPolls);
      } catch (error) {
        console.error('Erro ao buscar as enquetes do usuário:', error);
      }
    };

    fetchUserPolls();
  }, []);

  return (
    <div className="user-polls">
      <h2>Minhas Enquetes</h2>
      {polls.length === 0 ? (
        <p>Você não criou nenhuma enquete ainda.</p>
      ) : (
        <div className="polls-grid">
          {polls.map((poll) => (
            <div key={poll.id} className="poll-card">
              <h3>{poll.title}</h3>
              <p>{poll.description}</p>
              <button onClick={() => handleButtonClick(poll.id)}>Editar Enquete</button> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPolls;
