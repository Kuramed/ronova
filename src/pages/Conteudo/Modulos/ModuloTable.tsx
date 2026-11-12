import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IModulo } from "../../../models/conteudo.model";
import { ModuloService } from "../../../services/conteudo.service";

export function ModuloTable() {
  const [modulos, setModulos] = useState<IModulo[]>([]);

  useEffect(() => {
    ModuloService.listarTodos().then(setModulos);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Módulos</h2>
        <Link to="/modulos/novo" className="btn btn-primary">
          Novo Módulo
        </Link>
      </div>

      <table className="table table-bordered bg-white">
        <thead className="table-light">
          <tr>
            <th>Ordem</th>
            <th>Título do Módulo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {modulos.map((modulo) => (
            <tr key={modulo.id_modulo}>
              <td>{modulo.ordem}</td>
              <td>{modulo.titulo}</td>
              <td>
                <Link
                  to={`/modulos/editar/${modulo.id_modulo}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    ModuloService.excluir(modulo.id_modulo!).then(() =>
                      window.location.reload(),
                    )
                  }
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
