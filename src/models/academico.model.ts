export interface Category {
  id_Categoria: number;
  nome: string;
  descricao?: string;
}

export interface Lesson {
  id: number;
  idModulo: number;
  titulo: string;
  tipoConteudo: 'Vídeo' | 'Texto' | 'Quiz';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}

export interface Module {
  id: number;
  idCurso: number;
  titulo: string;
  ordem: number;
  aulas: Lesson[];
}

export interface Course {
  id: number;
  titulo: string;
  descricao: string;
  idInstrutor: number;
  idCategoria: number;
  nivel: 'Iniciante' | 'Intermediário' | 'Avançado';
  dataPublicacao?: string;
  totalAulas: number;
  totalHoras: number;
  categoria?: Category;
  modulos?: Module[];
}

export interface CourseDetail extends Course {
  modulos: Module[];
}