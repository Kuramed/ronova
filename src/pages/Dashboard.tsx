import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Estados para Edição de Usuário
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, cursosRes] = await Promise.all([
        api.get('/users').catch(() => ({ data: [] })),
        api.get('/cursos').catch(() => ({ data: [] })),
      ]);
      setUsers(usersRes.data);
      setCursos(cursosRes.data);
    } catch (err) {
      setError('Erro ao carregar os dados do painel.');
    }
  };

  // Prepara o formulário para editar o usuário selecionado
  const handleEditUser = (user: any) => {
    setEditingUserId(user.id);
    setName(user.name || user.Nome || '');
    setEmail(user.email || user.Email || '');
  };

  // Envia a atualização do usuário para a API
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await api.patch(`/users/${editingUserId}`, { name, email });
      setSuccess('Usuário atualizado com sucesso!');
      setEditingUserId(null);
      setName('');
      setEmail('');
      fetchData();
    } catch (err) {
      setError('Erro ao atualizar o usuário.');
    }
  };

  // Exclui o usuário
  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        setSuccess('Usuário excluído com sucesso!');
        fetchData();
      } catch (err) {
        setError('Erro ao excluir o usuário.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Painel de Controle (Dashboard)</h2>
          <p className="text-muted mb-0">Bem-vindo à área restrita da Plataforma de Cursos.</p>
        </div>
        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
          Sair do Sistema
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulário de Edição de Usuário (Aparece apenas quando estiver editando) */}
      {editingUserId && (
        <div className="card shadow-sm mb-4 border-warning">
          <div className="card-header bg-warning text-dark fw-bold">
            Editar Usuário (ID: {editingUserId})
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateUser}>
              <div className="row">
                <div className="col-md-5 mb-3">
                  <label className="form-label">Nome</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-md-5 mb-3">
                  <label className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end mb-3 gap-1">
                  <button type="submit" className="btn btn-success w-100">Salvar</button>
                  <button 
                    type="button" 
                    className="btn btn-secondary w-100" 
                    onClick={() => { setEditingUserId(null); setName(''); setEmail(''); }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabela de Usuários */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-bold">Usuários Cadastrados na Plataforma</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Data de Cadastro</th>
                  <th className="text-center" style={{ width: '160px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(users) && users.length > 0 ? (
                  users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="fw-bold">{u.name || u.Nome}</td>
                      <td>{u.email || u.Email}</td>
                      <td>{u.createdAt || u.DataCadastro}</td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-warning me-1 py-0 px-2" 
                          onClick={() => handleEditUser(u)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger py-0 px-2" 
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="text-center text-muted">Nenhum usuário cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Tabela de Cursos Disponíveis */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Cursos Disponíveis</div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome do Curso</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(cursos) && cursos.length > 0 ? (
                  cursos.map(c => (
                    <tr key={c.id || c.id_curso}>
                      <td>{c.id || c.id_curso}</td>
                      <td className="fw-bold">{c.titulo || c.Titulo}</td>
                      <td>{c.descricao || c.Descricao}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3} className="text-center text-muted">Nenhum curso cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}