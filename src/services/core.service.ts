import { apiFetch } from "./api";
import { ICategoria, ICurso, IUsuario } from "../models/core.model";

const fixId = (item: any, idName: string) => {
  if (!item) return item;
  return { ...item, [idName]: item[idName] || item.id };
};

export const CategoriaService = {
  listarTodas: async (): Promise<ICategoria[]> => {
    const data = await apiFetch("/categorias");
    const lista = Array.isArray(data) ? data : (data?.data || []);
    return lista.map((item: any) => fixId(item, "id_categoria"));
  },
  obterPorId: async (id: string): Promise<ICategoria> => {
    const data = await apiFetch(`/categorias/${id}`);
    return fixId(data, "id_categoria");
  },
  salvar: (categoria: ICategoria): Promise<ICategoria> => {
    const id = categoria.id_categoria || (categoria as any).id;
    return apiFetch(id ? `/categorias/${id}` : "/categorias", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(categoria),
    });
  },
  excluir: (id: string): Promise<void> =>
    apiFetch(`/categorias/${id}`, { method: "DELETE" }),
};

export const CursoService = {
  listarTodos: async (): Promise<ICurso[]> => {
    const data = await apiFetch("/cursos");
    const lista = Array.isArray(data) ? data : (data?.data || []);
    return lista.map((item: any) => fixId(item, "id_curso"));
  },
  obterPorId: async (id: string): Promise<ICurso> => {
    const data = await apiFetch(`/cursos/${id}`);
    return fixId(data, "id_curso");
  },
  salvar: (curso: ICurso): Promise<ICurso> => {
    const id = curso.id_curso || (curso as any).id;
    return apiFetch(id ? `/cursos/${id}` : "/cursos", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(curso),
    });
  },
  excluir: (id: string): Promise<void> =>
    apiFetch(`/cursos/${id}`, { method: "DELETE" }),
};

export const UsuarioService = {
  listarTodos: async (): Promise<IUsuario[]> => {
    const data = await apiFetch("/usuarios");
    return data.map((item: any) => fixId(item, "id_usuario"));
  },
  obterPorId: async (id: string): Promise<IUsuario> => {
    const data = await apiFetch(`/usuarios/${id}`);
    return fixId(data, "id_usuario");
  },
  salvar: (usuario: IUsuario): Promise<IUsuario> => {
    const id = usuario.id_usuario || (usuario as any).id;
    return apiFetch(id ? `/usuarios/${id}` : "/usuarios", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(usuario),
    });
  },
  excluir: (id: string): Promise<void> =>
    apiFetch(`/usuarios/${id}`, { method: "DELETE" }),
};
