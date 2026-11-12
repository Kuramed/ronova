import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export function PlanosManagement() {
  const [planos, setPlanos] = useState<any[]>([]);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [duracaoMeses, setDuracaoMeses] = useState('1');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchPlanos();
  }, []);

  const fetchPlanos = async () => {
    try {
      const response = await api.get('/planos');
      // Garante que a resposta seja um array
      setPlanos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Erro ao buscar planos:', err);
      setMessage({ type: 'danger', text: 'Erro ao carregar os planos.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const payload = {
        nome,
        descricao,
        preco: parseFloat(preco.replace(',', '.')), // Garante formato decimal
        duracaoMeses: parseInt(duracaoMeses, 10),
      };

      if (editingId) {
        await api.patch(`/planos/${editingId}`, payload);
        setMessage({ type: 'success', text: 'Plano atualizado com sucesso!' });
      } else {
        await api.post('/planos', payload);
        setMessage({ type: 'success', text: 'Plano criado com sucesso!' });
      }

      resetForm();
      fetchPlanos();
    } catch (err) {
      console.error('Erro ao salvar plano:', err);
      setMessage({ type: 'danger', text: 'Erro ao salvar o plano. Verifique os dados.' });
    }
  };

  const handleEdit = (plano: any) => {
    setEditingId(plano.id || plano.ID_Plano);
    setNome(plano.nome || plano.Nome || '');
    setDescricao(plano.descricao || plano.Descricao || '');
    setPreco(String(plano.preco || plano.Preco || ''));
    setDuracaoMeses(String(plano.duracaoMeses || plano.DuracaoMeses || '1'));
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza de que deseja excluir este plano permanentemente?')) {
      try {
        await api.delete(`/planos/${id}`);
        setMessage({ type: 'success', text: 'Plano excluído com sucesso!' });
        fetchPlanos();
      } catch (err) {
        console.error('Erro ao excluir plano:', err);
        setMessage({ type: 'danger', text: 'Erro ao excluir o plano.' });
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNome('');
    setDescricao('');
    setPreco('');
    setDuracaoMeses('1');
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Módulo de Negócios: Gestão de Planos</h2>
      <p className="text-muted">Crie e edite as opções de assinatura disponíveis na plataforma[cite: 9].</p>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      {/* Formulário de Criação/Edição */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white fw-bold">
          {editingId ? 'Editar Plano' : 'Cadastrar Novo Plano'}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nome do Plano <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                  placeholder="Ex: Plano Anual Premium"
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Preço (R$) <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-control" 
                  value={preco} 
                  onChange={e => setPreco(e.target.value)} 
                  required 
                  placeholder="0.00"
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Duração (Meses) <span className="text-danger">*</span></label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={duracaoMeses} 
                  onChange={e => setDuracaoMeses(e.target.value)} 
                  required 
                  min="1"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Descrição da Assinatura</label>
              <textarea 
                className="form-control" 
                rows={2} 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)} 
                placeholder="Detalhes sobre o que o plano oferece..."
              />
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'} w-100`}>
                {editingId ? 'Atualizar Plano' : 'Salvar Plano'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Tabela de Planos Cadastrados */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Planos Cadastrados</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="px-3">ID</th>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Duração</th>
                  <th className="text-center" style={{ width: '150px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {planos.length > 0 ? (
                  planos.map((plano) => {
                    const id = plano.id || plano.ID_Plano;
                    return (
                      <tr key={id}>
                        <td className="px-3">{id}</td>
                        <td className="fw-bold text-primary">{plano.nome || plano.Nome}</td>
                        <td className="text-muted small">{plano.descricao || plano.Descricao}</td>
                        <td className="fw-bold">R$ {Number(plano.preco || plano.Preco).toFixed(2)}</td>
                        <td>{plano.duracaoMeses || plano.DuracaoMeses} meses</td>
                        <td className="text-center">
                          <button 
                            className="btn btn-sm btn-outline-warning me-1 py-0 px-2" 
                            onClick={() => handleEdit(plano)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger py-0 px-2" 
                            onClick={() => handleDelete(id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      Nenhum plano cadastrado. Crie o seu primeiro plano acima!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}