import React, { useEffect, useState } from 'react';
import axios from '../axios'; 
import Poll from '../components/Poll.tsx'; 

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

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('/api/v1/polls'); 
        setPolls(response.data);
      } catch (error) {
        console.error('Erro ao buscar votações:', error);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div>
      <h1>Votações</h1>
      {polls.map(poll => (
        <Poll key={poll.id} id={poll.id} title={poll.title} description={poll.description} options={poll.options} />
      ))}
    </div>
  );
};

export default Home;
