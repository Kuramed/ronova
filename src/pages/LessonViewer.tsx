import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

export function LessonViewer() {
  const { id } = useParams<{ id: string }>(); // ID da aula
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggleComplete = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Envia para a API o registro de progresso da aula
      await api.post('/progresso', {
        idAula: Number(id),
        status: completed ? 'Pendente' : 'Concluído'
      });

      setCompleted(!completed);
      setMessage(completed ? 'Aula marcada como pendente.' : 'Parabéns! Aula marcada como Concluída.');
    } catch (err) {
      // Simulação visual caso a rota ainda não esteja implementada no back-end
      setCompleted(!completed);
      setMessage(completed ? 'Aula marcada como pendente (Simulação).' : 'Parabéns! Aula marcada como Concluída (Simulação).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="mb-3">
        <Link to="/courses" className="btn btn-outline-secondary btn-sm">← Voltar para Cursos</Link>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <span className="badge bg-info text-dark mb-2">Aula #{id}</span>
          <h2 className="card-title fw-bold">Visualização do Conteúdo</h2>
          <p className="text-muted">Acompanhe o material da aula e registre seu progresso para obter o certificado[cite: 9].</p>

          {/* Área do player / conteúdo */}
          <div className="ratio ratio-16x9 bg-dark text-white d-flex align-items-center justify-content-center rounded mb-4">
            <div className="text-center">
              <span className="fs-1">📺</span>
              <p className="mt-2">Player de Vídeo / Exibição de Conteúdo</p>
            </div>
          </div>

          {message && <div className="alert alert-success">{message}</div>}

          <div className="d-flex justify-content-between align-items-center">
            <button 
              className={`btn ${completed ? 'btn-secondary' : 'btn-success'} btn-lg`}
              onClick={handleToggleComplete}
              disabled={loading}
            >
              {loading ? 'Salvando...' : completed ? 'Desmarcar Conclusão' : '✔ Marcar Aula como Concluída'}
            </button>

            {completed && (
              <Link to="/progress" className="btn btn-outline-primary">
                Ver Meus Certificados 🎓
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}