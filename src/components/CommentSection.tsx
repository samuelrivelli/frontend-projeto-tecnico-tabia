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
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); 
  const [editContent, setEditContent] = useState<string>(''); 

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');

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

  const handleDelete = async (commentId: number) => {
    const confirmDelete = window.confirm('Você tem certeza que deseja deletar este comentário?');

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`/api/v1/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      setSuccess('Comentário apagado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar comentário:', error);
      setError('Ocorreu um erro ao deletar o comentário.');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>, commentId: number) => {
    e.preventDefault();

    try {
      const updatedCommentData = {
        content: editContent,
        userId: localStorage.getItem('userId'),
        pollId,
      };

      await axios.put(`/api/v1/comments/${commentId}`, updatedCommentData);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: editContent } : comment
        )
      );

      setSuccess('Comentário editado com sucesso!');
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
      setError('Ocorreu um erro ao editar seu comentário. Tente novamente.');
    }
  };

  const canEditOrDeleteComment = (commentUserId: number) => {
    return userRole === 'ADMIN' || parseInt(userId!) === commentUserId;
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
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.username}:</strong> {comment.content}
            </p>
            <p>
              <small>{new Date(comment.createdAt).toLocaleString()}</small>
            </p>

            {canEditOrDeleteComment(comment.userId) && (
              <>
                {editingCommentId === comment.id ? (
                  <form onSubmit={(e) => handleEditSubmit(e, comment.id)}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edite seu comentário..."
                      required
                    />
                    <button type="submit">Salvar</button>
                    <button type="button" onClick={() => setEditingCommentId(null)}>
                      Cancelar
                    </button>
                  </form>
                ) : (
                  <>
                    <button onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditContent(comment.content);
                    }}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(comment.id)}>Deletar</button>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
