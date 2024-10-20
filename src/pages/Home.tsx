import React, { useEffect, useState } from "react";
import axios from "../axios";
import Poll from "../components/Poll.tsx";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";

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

const Home = () => {
  const [polls, setPolls] = useState<PollDTO[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
    }

    setRole(userRole);

    const fetchPolls = async () => {
      try {
        const response = await axios.get("/api/v1/polls", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPolls(response.data);
      } catch (error) {
        console.error("Erro ao buscar votações:", error);
      }
    };

    fetchPolls();
  }, [navigate]);

  // Função para deletar uma enquete e removê-la da lista local
  const handleDeletePoll = (pollId: number) => {
    setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
  };

  return (
    <div>
      <h1>Votações</h1>
      <div className="home-buttons">
        <Link to="/create-poll">
          <button className="home-button create-poll">Criar Enquete</button>
        </Link>
        <Link to="/user-polls">
          <button className="home-button my-polls">Minhas Enquetes</button>
        </Link>
        {role === "ADMIN" && (
          <>
            <Link to="/register-admin">
              <button className="home-button register-admin">
                Cadastrar Admin
              </button>
            </Link>
            <Link to="/user-management">
              <button className="home-button user-management">
                Gerenciar Usuários
              </button>
            </Link>
          </>
        )}
        <Link to="/logout">
          <button className="home-button logout">Sair</button>
        </Link>
      </div>

      <div className="polls-container">
        {polls.map((poll) => (
          <Poll
            key={poll.id}
            id={poll.id}
            title={poll.title}
            description={poll.description}
            options={poll.options}
            onDelete={handleDeletePoll} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
