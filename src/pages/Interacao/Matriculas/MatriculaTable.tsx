import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IMatricula } from "../../../models/interacao.model";
import { MatriculaService } from "../../../services/interacao.service";

export function MatriculaTable() {
  const [matriculas, setMatriculas] = useState<IMatricula[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    MatriculaService.listarTodas().then(setMatriculas);
  };

  const excluir = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta matrícula?")) {
      return;
    }

    await MatriculaService.excluir(id);

    setMatriculas((lista) =>
      lista.filter((m) => m.id_matricula !== id)
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Matrículas dos Alunos</h2>

        <Link
          to="/matriculas/novo"
          className="btn btn-primary"
        >
          Nova Matrícula
        </Link>
      </div>

      <table className="table table-striped border shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID Curso</th>
            <th>ID Aluno</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {matriculas.map((matricula) => (
            <tr key={matricula.id_matricula}>
              <td>{matricula.id_curso}</td>

              <td>{matricula.id_usuario}</td>

              <td>
                <span
                  className={`badge ${
                    matricula.status === "Ativa"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {matricula.status}
                </span>
              </td>

              <td>
                <div className="d-flex gap-2">
                  <Link
                    to={`/matriculas/editar/${matricula.id_matricula}`}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </Link>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      excluir(matricula.id_matricula!)
                    }
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}