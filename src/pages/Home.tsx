import React, { useEffect, useState } from 'react';
import axios from '../axios'; 
import Poll from '../components/Poll.tsx'; 
import { Link, useNavigate } from "react-router-dom"; 

interface Option {
  id: number;
  text: string;
}

interface PollDTO {
  id: number;
  title: string;
  description: string;
  options: Option[];
}

const Home = () => {
  const [polls, setPolls] = useState<PollDTO[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchPolls = async () => {
      try {
        const response = await axios.get('/api/v1/polls', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPolls(response.data);
      } catch (error) {
        console.error('Erro ao buscar votações:', error);
      }
    };

    fetchPolls();
  }, [navigate]);

  return (
    <div>
      <h1>Votações</h1>
      <Link to="/logout"> 
        <button>Sair</button>
      </Link>
      {polls.map(poll => (
        <Poll key={poll.id} id={poll.id} title={poll.title} description={poll.description} options={poll.options} />
      ))}
    </div>
  );
};

export default Home;
