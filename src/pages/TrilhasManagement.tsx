import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function TrilhasManagement() {
  const [trilhas, setTrilhas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  
  // Estado para controlar se estamos a editar um registro existente
  const [editingId, setEditingId] = useState<number | null>(null);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trilhasRes, catsRes] = await Promise.all([
        api.get('/trilhas').catch(() => ({ data: [] })),
        api.get('/categorias').catch(() => ({ data: [] })),
      ]);
      setTrilhas(trilhasRes.data);
      setCategorias(catsRes.data);
    } catch (err) {
      setError('Erro ao carregar dados.');
    }
  };

  // Função unificada para Criar ou Atualizar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const payload = {
        titulo,
        descricao,
        idCategoria: Number(idCategoria),
      };

      if (editingId) {
        // Modo Edição (PUT ou PATCH)
        await api.patch(`/trilhas/${editingId}`, payload);
        setSuccess('Trilha atualizada com sucesso!');
      } else {
        // Modo Criação (POST)
        await api.post('/trilhas', payload);
        setSuccess('Trilha criada com sucesso!');
      }

      // Limpa o formulário e reseta o estado de edição
      setTitulo('');
      setDescricao('');
      setIdCategoria('');
      setEditingId(null);
      
      fetchData(); // Recarrega a tabela
    } catch (err) {
      console.error(err);
      setError('Erro ao salvar a trilha.');
    }
  };

  // Prepara o formulário para edição
  const handleEdit = (trilha: any) => {
    setEditingId(trilha.id || trilha.ID_Trilha);
    setTitulo(trilha.titulo || trilha.Titulo);
    setDescricao(trilha.descricao || trilha.Descricao);
    setIdCategoria(trilha.idCategoria || trilha.ID_Categoria || '');
  };

  // Função de Exclusão
  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir esta trilha?')) {
      try {
        await api.delete(`/trilhas/${id}`);
        setSuccess('Trilha excluída com sucesso!');
        fetchData(); // Atualiza a lista na tabela
      } catch (err) {
        console.error(err);
        setError('Erro ao excluir a trilha.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Módulo de Curadoria: Trilhas de Conhecimento</h2>
      <p className="text-muted">Gerencie o ciclo de vida das trilhas de aprendizado.</p>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Formulário Dinâmico (Criação / Edição) */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          {editingId ? 'Editar Trilha' : 'Cadastrar Nova Trilha'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Título da Trilha</label>
              <input 
                type="text" 
                className="form-control" 
                value={titulo} 
                onChange={e => setTitulo(e.target.value)} 
                required 
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Descrição</label>
              <textarea 
                className="form-control" 
                rows={2} 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Categoria da Trilha</label>
              <select 
                className="form-select" 
                value={idCategoria} 
                onChange={e => setIdCategoria(e.target.value)} 
                required
              >
                <option value="">Selecione uma categoria...</option>
                {categorias.map((cat: any) => (
                  <option key={cat.id_categoria || cat.id} value={cat.id_categoria || cat.id}>
                    {cat.nome || cat.Nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'} w-100`}>
                {editingId ? 'Atualizar Trilha' : 'Salvar Trilha'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => { setEditingId(null); setTitulo(''); setDescricao(''); setIdCategoria(''); }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Tabela com Botões de Ação */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Trilhas Cadastradas</div>
        <div className="card-body">
          <table className="table table-striped align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descrição</th>
                <th className="text-center" style={{ width: '180px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(trilhas) && trilhas.length > 0 ? (
                trilhas.map(t => {
                  const id = t.id || t.ID_Trilha;
                  return (
                    <tr key={id}>
                      <td>{id}</td>
                      <td className="fw-bold">{t.titulo || t.Titulo}</td>
                      <td>{t.descricao || t.Descricao}</td>
                      <td className="text-center">
                        <button 
                          className="btn btn-sm btn-outline-warning me-2" 
                          onClick={() => handleEdit(t)}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDelete(id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan={4} className="text-center text-muted">Nenhuma trilha cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}