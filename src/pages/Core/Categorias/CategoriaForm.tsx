import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CategoriaService } from "../../../services/core.service";
import { ICategoria } from "../../../models/core.model";

export function CategoriaForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<ICategoria>({
    nome: "",
    descricao: "",
  });

  useEffect(() => {
    if (id) {
      CategoriaService.listarTodas().then((lista) => {
        const item = lista.find((c) => c.id_categoria === id);
        if (item) setFormData(item);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await CategoriaService.salvar(formData);
    navigate("/categorias");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Categoria" : "Nova Categoria"}</h2>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
        <div className="mb-3">pages
          <label className="form-label">Nome da Categoria</label>
          <input
            type="text"
            className="form-control"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
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
            Guardar
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/categorias")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
