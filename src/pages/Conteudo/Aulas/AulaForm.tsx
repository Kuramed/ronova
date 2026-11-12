import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AulaService, ModuloService } from "../../../services/conteudo.service";
import { IAula, IModulo } from "../../../models/conteudo.model";

export function AulaForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [modulos, setModulos] = useState<IModulo[]>([]);

  const [formData, setFormData] = useState<IAula>({
    id_modulo: "",
    titulo: "",
    conteudoUrl: "",
    descricao: "",
    duracaoMinutos: 10,
    ordem: 1,
  });

  useEffect(() => {
    ModuloService.listarTodos().then(setModulos);

    if (id) {
      AulaService.listarTodas().then((lista) => {
        const aulaEditada = lista.find((a) => a.id_aula === id);
        if (aulaEditada) setFormData(aulaEditada);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await AulaService.salvar(formData);
    navigate("/aulas");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Aula" : "Nova Aula"}</h2>

      <form onSubmit={handleSubmit} className="card p-4 mt-3">
        <div className="mb-3">
          <label className="form-label">Vincular ao Módulo</label>
          <select
            className="form-select"
            value={formData.id_modulo}
            onChange={(e) =>
              setFormData({ ...formData, id_modulo: e.target.value })
            }
            required
          >
            <option value="">Selecione o Módulo...</option>
            {modulos.map((modulo) => (
              <option key={modulo.id_modulo} value={modulo.id_modulo}>
                {modulo.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label">Título da Aula</label>
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
          <div className="col-md-2 mb-3">
            <label className="form-label">Duração (Min)</label>
            <input
              type="number"
              className="form-control"
              value={formData.duracaoMinutos}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  duracaoMinutos: Number(e.target.value),
                })
              }
              min="1"
              required
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Ordem</label>
            <input
              type="number"
              className="form-control"
              value={formData.ordem}
              onChange={(e) =>
                setFormData({ ...formData, ordem: Number(e.target.value) })
              }
              min="1"
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">
            URL do Conteúdo (Ex: Link do YouTube/Vimeo)
          </label>
          <input
            type="url"
            className="form-control"
            value={formData.conteudoUrl}
            onChange={(e) =>
              setFormData({ ...formData, conteudoUrl: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Descrição / Notas da Aula</label>
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
            Guardar Aula
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/aulas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
