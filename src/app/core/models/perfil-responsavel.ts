export interface PerfilResponsavel {
    id: number;
    nome: string;
    email: string;
    telefone: string | null;
    role: 'RESPONSAVEL';
}