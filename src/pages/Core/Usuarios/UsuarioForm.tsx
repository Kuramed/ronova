import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UsuarioService } from "../../../services/core.service";
import { IUsuario } from "../../../models/core.model";

export function UsuarioForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<IUsuario>({
    nomeCompleto: "",
    email: "",
    senhaHash: "",
    tipo: "Aluno",
  });

  useEffect(() => {
    if (id) {
      UsuarioService.listarTodos().then((lista) => {
        const usuarioEditado = lista.find((u) => u.id_usuario === id);
        if (usuarioEditado) setFormData(usuarioEditado);
      });
    }
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await UsuarioService.salvar(formData);
    navigate("/usuarios");
  };

  return (
    <div className="container mt-4">
      <h2>{id ? "Editar Utilizador" : "Novo Utilizador"}</h2>

      <form onSubmit={handleSubmit} className="card p-4 mt-3 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nome Completo</label>
            <input
              type="text"
              className="form-control"
              value={formData.nomeCompleto}
              onChange={(e) =>
                setFormData({ ...formData, nomeCompleto: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Palavra-passe</label>
            {/* Se for edição, pode querer deixar este campo opcional na vida real */}
            <input
              type="password"
              className="form-control"
              value={formData.senhaHash}
              onChange={(e) =>
                setFormData({ ...formData, senhaHash: e.target.value })
              }
              required={!id}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Tipo de Conta</label>
            <select
              className="form-select"
              value={formData.tipo}
              onChange={(e) =>
                setFormData({ ...formData, tipo: e.target.value as any })
              }
            >
              <option value="Aluno">Aluno</option>
              <option value="Instrutor">Instrutor</option>
              <option value="Admin">Administrador</option>
            </select>
          </div>
        </div>

        <div className="d-flex gap-2 mt-2">
          <button type="submit" className="btn btn-success">
            Guardar Utilizador
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/usuarios")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
