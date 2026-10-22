export interface Evento {
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
    status: string;
}