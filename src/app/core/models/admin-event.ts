export type EventStatus =
    | 'AGENDADO'
    | 'CANCELADO'
    | 'FINALIZADO';

export interface StudentResponse {
    id: number;
    nome: string;
    dataNascimento: string;
    turma: string;
}

export interface AdminEvent {
    id: number;
    titulo: string;
    descricao: string;
    data: string;
    horaInicio: string | null;
    horaFim: string | null;
    local: string | null;
    observacoes: string | null;
    whatsappUrl: string | null;
    bannerUrl: string | null;
    status: EventStatus;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
    students: StudentResponse[];
}