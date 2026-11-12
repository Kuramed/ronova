import { apiFetch } from "./api";
import { IModulo, IAula } from "../models/conteudo.model";

const fixId = (item: any, idName: string) => {
  if (!item) return item;
  return { ...item, [idName]: item[idName] || item.id };
};

export const ModuloService = {
  listarTodos: async (): Promise<IModulo[]> => {
    const data = await apiFetch("/modulos");
    return data.map((item: any) => fixId(item, "id_modulo"));
  },
  listarPorCurso: async (id_curso: string): Promise<IModulo[]> => {
    const data = await apiFetch(`/modulos?id_curso=${id_curso}`);
    return data.map((item: any) => fixId(item, "id_modulo"));
  },
  salvar: (modulo: IModulo): Promise<IModulo> => {
    const id = modulo.id_modulo || (modulo as any).id;
    return apiFetch(id ? `/modulos/${id}` : "/modulos", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(modulo),
    });
  },
  excluir: (id: string): Promise<void> =>
    apiFetch(`/modulos/${id}`, { method: "DELETE" }),
};

export const AulaService = {
  listarTodas: async (): Promise<IAula[]> => {
    const data = await apiFetch("/aulas");
    return data.map((item: any) => fixId(item, "id_aula"));
  },
  listarPorModulo: async (id_modulo: string): Promise<IAula[]> => {
    const data = await apiFetch(`/aulas?id_modulo=${id_modulo}`);
    return data.map((item: any) => fixId(item, "id_aula"));
  },
  salvar: (aula: IAula): Promise<IAula> => {
    const id = aula.id_aula || (aula as any).id;
    return apiFetch(id ? `/aulas/${id}` : "/aulas", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(aula),
    });
  },
  excluir: (id: string): Promise<void> =>
    apiFetch(`/aulas/${id}`, { method: "DELETE" }),
};
