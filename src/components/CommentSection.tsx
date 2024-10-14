import React, { useEffect, useState } from 'react';
import axios from '../axios'; 

interface Comment {
  id: number;
  content: string;
  createdAt: string; 
}

interface CommentSectionProps {
  pollId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ pollId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get<Comment[]>(`api/v1/polls/${pollId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Erro ao buscar comentários:', error);
      }
    };

    fetchComments();
  }, [pollId]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`api/v1/polls/${pollId}/comments`, { content: commentText });
      setCommentText('');
      const response = await axios.get<Comment[]>(`api/v1/polls/${pollId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3>Comentários</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
        <button type="submit">Adicionar Comentário</button>
      </form>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentSection;
