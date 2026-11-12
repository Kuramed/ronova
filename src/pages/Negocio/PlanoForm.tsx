import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PlanoService } from "../../services/negocio.service";
import { IPlano } from "../../models/negocio.model";

export function PlanoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<IPlano>({
    nome: "",
    preco: 0,
    duracaoMeses: 1,
    descricao: "",
  });

  useEffect(() => {
  if (id) {
    PlanoService.listarTodos().then((lista) => {
      const item = lista.find(
        (p) => String(p.id_plano) === String(id)
      );

      if (item) {
        setFormData({
          id_plano: item.id_plano,
          nome: item.nome,
          preco: item.preco,
          duracaoMeses: item.duracaoMeses,
          descricao: item.descricao || "",
        });
      }
    });
  }
}, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await PlanoService.salvar(formData);
    navigate("/planos");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Plano" : "Novo Plano"}</h2>
      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Nome do Plano</label>
          <input
            type="text"
            className="form-control"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Preço (€)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={formData.preco}
              onChange={(e) =>
                setFormData({ ...formData, preco: Number(e.target.value) })
              }
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Duração (Meses)</label>
            <input
              type="number"
              className="form-control"
              value={formData.duracaoMeses}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duracaoMeses: Number(e.target.value),
                })
              }
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição das Vantagens</label>
          <textarea
            className="form-control"
            rows={3}
            value={formData.descricao}
            onChange={(e) =>
              setFormData({ ...formData, descricao: e.target.value })
            }
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Guardar Plano
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/planos")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
