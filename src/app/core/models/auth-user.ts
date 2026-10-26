export type UserRole = 'ADMIN' | 'RESPONSAVEL';

export interface AuthUser {
    id: number;
    nome: string;
    email: string;
    role: UserRole;
}