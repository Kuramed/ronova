import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TrilhaService } from "../../../services/curadoria.service";
import { CategoriaService } from "../../../services/core.service";
import { ITrilha } from "../../../models/curadoria.model";
import { ICategoria } from "../../../models/core.model";

export function TrilhaForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  const [formData, setFormData] = useState<ITrilha>({
    titulo: "",
    descricao: "",
    id_categoria: "",
  });

  useEffect(() => {
    CategoriaService.listarTodas().then(setCategorias);
    if (id) {
      TrilhaService.listarTodas().then((lista) => {
        const item = lista.find((t) => t.id_trilha === id);
        if (item) setFormData(item);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await TrilhaService.salvar(formData);
    navigate("/trilhas");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Trilha" : "Nova Trilha"}</h2>
      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Título da Trilha</label>
          <input
            type="text"
            className="form-control"
            value={formData.titulo}
            onChange={(e) =>
              setFormData({ ...formData, titulo: e.target.value })
            }
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Categoria Base</label>
          <select
            className="form-select"
            value={formData.id_categoria}
            onChange={(e) =>
              setFormData({ ...formData, id_categoria: e.target.value })
            }
            required
          >
            <option value="">Selecione...</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Descrição Detalhada</label>
          <textarea
            className="form-control"
            rows={4}
            value={formData.descricao}
            onChange={(e) =>
              setFormData({ ...formData, descricao: e.target.value })
            }
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success">
            Guardar Trilha
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/trilhas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
