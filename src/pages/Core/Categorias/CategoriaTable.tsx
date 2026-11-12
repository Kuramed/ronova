import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICategoria } from "../../../models/core.model";
import { CategoriaService } from "../../../services/core.service";

export function CategoriaTable() {
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  useEffect(() => {
    CategoriaService.listarTodas().then(setCategorias);
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Categorias</h2>
        <Link to="/categorias/novo" className="btn btn-primary">
          Nova Categoria
        </Link>
      </div>

      <table className="table table-striped border shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id_categoria}>
              <td>
                <strong>{categoria.nome}</strong>
              </td>
              <td>{categoria.descricao}</td>
              <td>
                <Link
                  to={`/categorias/editar/${categoria.id_categoria}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Editar
                </Link>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() =>
                    CategoriaService.excluir(categoria.id_categoria!).then(() =>
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
