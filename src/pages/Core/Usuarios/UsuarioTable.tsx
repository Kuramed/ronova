import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IUsuario } from "../../../models/core.model";
import { UsuarioService } from "../../../services/core.service";

export function UsuarioTable() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = () => {
    UsuarioService.listarTodos().then(setUsuarios);
  };

  const handleExcluir = async (usuario: any) => {
    const idParaExcluir = usuario.id_usuario || usuario.id;

    if (!idParaExcluir) {
      console.error("ID não encontrado para este utilizador:", usuario);
      alert("Erro: Não foi possível identificar o utilizador para exclusão.");
      return;
    }

    const confirmar = window.confirm(
      `Tem a certeza que deseja excluir o utilizador ${usuario.nomeCompleto}?`,
    );

    if (confirmar) {
      try {
        await UsuarioService.excluir(idParaExcluir);

        carregarUsuarios();
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Ocorreu um erro ao tentar excluir. Verifique a consola (F12).");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Utilizadores</h2>
        <Link to="/usuarios/novo" className="btn btn-primary">
          Novo Utilizador
        </Link>
      </div>

      <table className="table table-striped border shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario: any) => {
            const chaveId = usuario.id_usuario || usuario.id;

            return (
              <tr key={chaveId}>
                <td>
                  <strong>{usuario.nomeCompleto}</strong>
                </td>
                <td>{usuario.email}</td>
                <td>{usuario.tipo}</td>
                <td>
                  <Link
                    to={`/usuarios/editar/${chaveId}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleExcluir(usuario)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
