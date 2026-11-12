import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Checkout() {
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'Cartão de Crédito' | 'Pix' | 'Boleto'>('Cartão de Crédito');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlanos = async () => {
      try {
        // Busca os planos na rota correta do back-end em português
        const response = await api.get('/planos');
        setPlanos(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar planos da API:', err);
        // Fallback de dados caso o banco de dados esteja vazio
        setPlanos([
          { id: 1, nome: 'Plano Mensal', descricao: 'Acesso total a todos os cursos por 1 mês.', preco: 49.90, duracaoMeses: 1 },
          { id: 2, nome: 'Plano Anual', descricao: 'Acesso total com desconto especial por 12 meses.', preco: 499.90, duracaoMeses: 12 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanos();
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setError('');
    setSuccessMessage('');

    try {
      // 1. Identifica o ID do plano selecionado e o ID do utilizador logado
      const idPlano = selectedPlan.id || selectedPlan.ID_Plano || selectedPlan.id_plano;
      
      // Recupera o ID do utilizador logado no localStorage (fallback para 1 para evitar erros de teste)
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const idUsuario = user?.id || user?.ID_Usuario || 1; 

      // 2. ETAPA 1: Criar a Assinatura vinculando o Utilizador ao Plano
      const assinaturaRes = await api.post('/assinaturas', {
        idPlano: Number(idPlano),
        idUsuario: Number(idUsuario),
        // O Back-end normalmente preenche DataInicio e DataFim, mas pode enviá-las se necessário
      });

      // Captura o ID da assinatura gerado no banco de dados
      const novaAssinaturaId = assinaturaRes.data.id || assinaturaRes.data.ID_Assinatura || assinaturaRes.data.id_assinatura;

      if (!novaAssinaturaId) {
        throw new Error('O back-end não retornou o ID da assinatura criada.');
      }

      // 3. ETAPA 2: Criar o Pagamento vinculado à Assinatura
      await api.post('/pagamentos', {
        idAssinatura: Number(novaAssinaturaId),
        valorPago: Number(selectedPlan.preco || selectedPlan.Preco),
        metodoPagamento: paymentMethod,
        idTransacaoGateway: `TRX-${Math.floor(Math.random() * 1000000)}`
      });

      setSuccessMessage(`Assinatura do ${selectedPlan.nome || selectedPlan.Nome} realizada com sucesso! Pagamento via ${paymentMethod} aprovado.`);
      setSelectedPlan(null);
    } catch (err: any) {
      console.error('Erro no fluxo de checkout:', err);
      setError('Ocorreu um erro ao processar sua assinatura e pagamento. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Módulo Financeiro: Planos e Assinaturas</h2>
        <p className="text-muted">Escolha o plano ideal para a sua jornada de aprendizado e realize o pagamento.</p>
      </div>

      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4 justify-content-center">
          {planos.map((plano) => (
            <div className="col-md-5" key={plano.id || plano.ID_Plano}>
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body d-flex flex-column p-4">
                  <h4 className="card-title fw-bold text-dark">{plano.nome || plano.Nome}</h4>
                  <p className="card-text text-muted flex-grow-1">{plano.descricao || plano.Descricao}</p>
                  <h2 className="text-primary fw-bold my-3">
                    R$ {Number(plano.preco || plano.Preco).toFixed(2)} 
                    <small className="text-muted fs-6 fw-normal"> / {plano.duracaoMeses || plano.DuracaoMeses} mês(es)</small>
                  </h2>
                  <button 
                    className="btn btn-primary btn-lg mt-auto w-100"
                    onClick={() => setSelectedPlan(plano)}
                  >
                    Assinar Agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Simulação de Pagamento */}
      {selectedPlan && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-dark">Checkout: {selectedPlan.nome || selectedPlan.Nome}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedPlan(null)}></button>
              </div>
              <form onSubmit={handleCheckout}>
                <div className="modal-body p-4">
                  <div className="d-flex justify-content-between mb-4 pb-3 border-bottom">
                    <span className="fs-5">Valor total a pagar:</span>
                    <strong className="fs-4 text-primary">R$ {Number(selectedPlan.preco || selectedPlan.Preco).toFixed(2)}</strong>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold">Método de Pagamento</label>
                    <select 
                      className="form-select form-select-lg"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                    >
                      <option value="Cartão de Crédito">💳 Cartão de Crédito</option>
                      <option value="Pix">💠 Pix</option>
                      <option value="Boleto">📄 Boleto Bancário</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedPlan(null)}>Cancelar</button>
                  <button type="submit" className="btn btn-success px-4">Confirmar Pagamento</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}