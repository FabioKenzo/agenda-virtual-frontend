export interface CreateStudentRequest {
    nome: string;
    dataNascimento: string;
    turma: string;
}

export interface CreateStudentsRequest {
    alunos: CreateStudentRequest[];
}