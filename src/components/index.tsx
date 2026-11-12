import { useState } from "react";
import { NavLink } from "react-router-dom";

export function Nav() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <>
      {/* Barra Superior */}
      <header className="navbar navbar-dark bg-dark mb-4 shadow-sm py-2 px-3">
        <div className="container-fluid d-flex align-items-center">
          <button
            className="btn btn-dark me-3 border-secondary"
            onClick={() => setMenuAberto(true)}
          >
            <i className="bi bi-list fs-3"></i>
          </button>

          <NavLink className="navbar-brand fw-bold fs-4 m-0" to="/">
            Plataforma SGC
          </NavLink>
        </div>
      </header>

      {/* Fundo escuro */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1040,
          }}
        />
      )}

      {/* Menu Lateral */}
      <div
        className={`bg-dark text-white shadow ${
          menuAberto ? "d-block" : "d-none"
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "280px",
          height: "100vh",
          zIndex: 1050,
          overflowY: "auto",
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-secondary">
          <h5 className="fw-bold text-info m-0">
            Navegação Geral
          </h5>

          <button
            className="btn-close btn-close-white"
            onClick={() => setMenuAberto(false)}
          />
        </div>

        <div className="list-group list-group-flush">

          {/* CORE */}
          <div className="p-3 bg-secondary bg-opacity-10 text-muted small fw-bold text-uppercase border-bottom border-secondary">
            Core (Cadastros)
          </div>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/usuarios"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-people me-2"></i>
            Usuários
          </NavLink>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/categorias"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-tags me-2"></i>
            Categorias
          </NavLink>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/cursos"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-book me-2"></i>
            Cursos
          </NavLink>

          {/* CONTEÚDO */}
          <div className="p-3 bg-secondary bg-opacity-10 text-muted small fw-bold text-uppercase border-bottom border-secondary">
            Conteúdo
          </div>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/modulos"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-collection me-2"></i>
            Módulos
          </NavLink>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/aulas"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-play-btn me-2"></i>
            Aulas
          </NavLink>

          {/* CURADORIA */}
          <div className="p-3 bg-secondary bg-opacity-10 text-muted small fw-bold text-uppercase border-bottom border-secondary">
            Curadoria
          </div>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/trilhas"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-signpost-split me-2"></i>
            Trilhas
          </NavLink>

          {/* INTERAÇÃO */}
          <div className="p-3 bg-secondary bg-opacity-10 text-muted small fw-bold text-uppercase border-bottom border-secondary">
            Interação
          </div>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/matriculas"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-journal-check me-2"></i>
            Matrículas
          </NavLink>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/avaliacoes"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-star me-2"></i>
            Avaliações
          </NavLink>

          {/* NEGÓCIO */}
          <div className="p-3 bg-secondary bg-opacity-10 text-muted small fw-bold text-uppercase border-bottom border-secondary">
            Negócio
          </div>

          <NavLink
            className="list-group-item list-group-item-action bg-dark text-white border-secondary"
            to="/planos"
            onClick={() => setMenuAberto(false)}
          >
            <i className="bi bi-credit-card me-2"></i>
            Planos
          </NavLink>

        </div>
      </div>
    </>
  );
}