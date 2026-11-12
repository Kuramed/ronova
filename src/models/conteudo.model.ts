import { z } from "zod";

export const ModuloSchema = z.object({
  id_modulo: z.string().optional(),
  id_curso: z.string().min(1, "É necessário associar a um curso"),
  titulo: z.string().min(3, "O título do módulo é obrigatório"),
  ordem: z.coerce.number().min(1, "A ordem tem de ser um número válido"),
});

export type IModulo = z.infer<typeof ModuloSchema>;

export const AulaSchema = z.object({
  id_aula: z.string().optional(),
  id_modulo: z.string().min(1, "É necessário associar a um módulo"),
  titulo: z.string().min(3, "O título da aula é obrigatório"),
  conteudoUrl: z.string().url("Insira um URL válido para a aula"),
  descricao: z.string().optional(),
  duracaoMinutos: z.coerce.number().default(10),
  ordem: z.coerce.number().min(1, "A ordem tem de ser um número válido"),
});

export type IAula = z.infer<typeof AulaSchema>;
