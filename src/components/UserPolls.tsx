import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
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
  userId: number;
}

const UserPolls = () => {
  const [polls, setPolls] = useState<PollDTO[]>([]);
  const navigate = useNavigate();

  const handleButtonClick = (pollId: number) => {
    navigate(`/edit-poll/${pollId}`);
  };

  const handleDeletePoll = async (pollId: number) => {
    
    if (window.confirm("Você tem certeza que deseja deletar esta enquete?")) {
      try {
        await axios.delete(`/api/v1/polls/${pollId}`);

        setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
        alert("Enquete deletada com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar a enquete:", error);
        alert("Ocorreu um erro ao tentar deletar a enquete.");
      }
    }
  };

  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const response = await axios.get("/api/v1/polls");

        const userId = localStorage.getItem("userId");
        const userPolls = response.data.filter(
          (poll: PollDTO) => poll.userId === Number(userId)
        );
        setPolls(userPolls);
      } catch (error) {
        console.error("Erro ao buscar as enquetes do usuário:", error);
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
              <div className="button-group">
                <button
                  onClick={() => handleButtonClick(poll.id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Editar Enquete
                </button>
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Deletar Enquete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPolls;
