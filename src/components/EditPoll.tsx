import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/EditPoll.css";

interface Option {
  id: number;
  text: string;
  poolId: number;
  voteCount: number;
}

interface PollDTO {
  id: number;
  title: string;
  description: string;
  userId: number;
  options: Option[];
  createdAt: string;
  isOpen: boolean;
}

const EditPoll = () => {
  const [poll, setPoll] = useState<PollDTO | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
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
        console.error("Erro ao buscar a votação:", error);
        setError("Erro ao carregar a votação. Verifique se ela existe.");
      }
    };

    fetchPoll();
  }, [id]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const handleAddOption = async () => {
    const newOption: Omit<Option, "id"> = {
      text: "",
      poolId: poll ? poll.id : 0,
      voteCount: 0,
    };

    try {
      const response = await axios.post(`/api/v1/options`, newOption);
      setOptions([...options, response.data]);
    } catch (error) {
      console.error("Erro ao adicionar nova opção:", error);
      setError("Erro ao adicionar nova opção.");
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updatedPoll = {
        ...poll,
        title,
        description,
      };

      console.log("JSON sendo enviado:", updatedPoll);

      await axios.put(`/api/v1/polls/${id}`, updatedPoll);

      await Promise.all(
        options.map((option) =>
          axios.put(`/api/v1/options/${option.id}`, {
            text: option.text,
            poolId: option.poolId,
            voteCount: option.voteCount,
          })
        )
      );

      console.log("Poll atualizados com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao atualizar a votação:", error);
      setError("Erro ao atualizar a votação. Tente novamente.");
    }
  };

  const handleTogglePollStatus = async () => {
    if (!poll) return;

    const updatedPoll = {
      ...poll,
      isOpen: !poll.isOpen,
    };

    console.log("JSON para atualizar o status:", updatedPoll);

    try {
      await axios.put(`/api/v1/polls/${id}`, updatedPoll);
      setPoll(updatedPoll);
    } catch (error) {
      console.error("Erro ao atualizar o status da votação:", error);
      setError("Erro ao atualizar o status da votação. Tente novamente.");
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  if (!poll) return <p>Carregando...</p>;

  return (
    <div className="container">
      <h1>Editar Votação</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
          <div key={option.id} className="option-container">
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
              Remover Opção
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
            Salvar Alterações
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`toggle-button ${
              poll.isOpen ? "toggle-button-close" : "toggle-button-open"
            }`}
            onClick={handleTogglePollStatus}
          >
            {poll.isOpen ? "Fechar Enquete" : "Abrir Enquete"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPoll;
