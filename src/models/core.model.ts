import { z } from "zod";

export const CategoriaSchema = z.object({
  id_categoria: z.string().optional(),
  nome: z.string().min(3, "O nome deve ter pelo menos 3 letras"),
  descricao: z.string().optional(),
});
export type ICategoria = z.infer<typeof CategoriaSchema>;

export const UsuarioSchema = z.object({
  id_usuario: z.string().optional(),
  nomeCompleto: z.string().min(5, "Insira o nome completo"),
  email: z.string().email("Email inválido"),
  senhaHash: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  tipo: z.enum(["Aluno", "Instrutor", "Admin"]).default("Aluno"),
  dataCadastro: z.string().optional(),
});
export type IUsuario = z.infer<typeof UsuarioSchema>;

export const CursoSchema = z.object({
  id_curso: z.string().optional(),
  titulo: z.string().min(5, "O título é obrigatório"),
  descricao: z.string().optional(),
  id_categoria: z.string().min(1, "Selecione uma categoria"),
  nivel: z.enum(["Básico", "Intermediário", "Avançado"]).default("Básico"),
  totalHoras: z.number().min(1, "Deve ter pelo menos 1 hora"),
  id_instrutor: z.string().min(1, "Selecione um instrutor"),
  totalAulas: z.number().default(0),
  dataCriacao: z.string().optional(),
});
export type ICurso = z.infer<typeof CursoSchema>;
