import React, { useEffect, useState } from 'react';
import axios from '../axios';

interface Comment {
  id: number;
  content: string;
  userId: number; 
  username: string;  
  pollId: number;
  createdAt: string;
}

interface CommentSectionProps {
  pollId: number; 
}

const CommentSection: React.FC<CommentSectionProps> = ({ pollId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('/api/v1/comments'); 
        const filteredComments = response.data.filter((comment: Comment) => comment.pollId === pollId);
        setComments(filteredComments);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    };

    fetchComments();
  }, [pollId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const commentData = {
        content,
        userId: localStorage.getItem('userId'), 
        pollId,
      };

      const response = await axios.post('/api/v1/comments', commentData);
      setComments((prevComments) => [...prevComments, response.data]); 
      setSuccess('Comentário enviado com sucesso!');
      setContent('');  
    } catch (err) {
      console.error('Erro ao enviar comentário:', err);
      setError('Ocorreu um erro ao enviar seu comentário. Tente novamente.');
    }
  };

  return (
    <div>
      <h3>Comentários</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva seu comentário..."
          required
        />
        <button type="submit">Enviar Comentário</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <div>
        {comments.map(comment => (
          <div key={comment.id}>
            <p><strong>{comment.username}:</strong> {comment.content}</p> 
            <p><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
