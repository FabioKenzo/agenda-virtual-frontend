import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponsavelService } from '../../../core/services/responsavel.service';

@Component({
  selector: 'app-alunos-cadastro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './alunos-cadastro.component.html',
  styleUrl: './alunos-cadastro.component.css'
})
export class AlunosCadastroComponent {

  private readonly fb = inject(FormBuilder).nonNullable;

  readonly turmas = ['G1', 'G2', 'G3', 'G4', 'G5'];

  readonly dataMaxima = this.formatarDataLocal(new Date());

  revisando = false;

  private readonly responsavelService = inject(ResponsavelService);

  salvando = false;

  cadastroConcluido = false;

  erroCadastro = '';

  readonly formCadastro = this.fb.group({
    alunos: this.fb.array([
      this.criarFormularioAluno()
    ])
  });

  get alunos(): FormArray {
    return this.formCadastro.controls.alunos;
  }

  private criarFormularioAluno() {
    return this.fb.group({
      nome: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(/.*\S.*/)
      ]],
      dataNascimento: ['', [
        Validators.required,
        this.validarDataNascimento
      ]],
      turma: ['', [
        Validators.required,
        Validators.pattern(/^G[1-5]$/)
      ]]
    });
  }

  adicionarAluno(): void {
    if (this.alunos.length >= 10) return;

    this.alunos.push(this.criarFormularioAluno());
  }

  removerAluno(index: number): void {
    if (this.alunos.length <= 1) return;

    this.alunos.removeAt(index);
  }

  private validarDataNascimento(control: { value: string | null }) {
    if (!control.value) return null;

    const data = new Date(`${control.value}T12:00:00`);
    const hoje = new Date();

    if (Number.isNaN(data.getTime())) {
      return { dataInvalida: true };
    }

    hoje.setHours(23, 59, 59, 999);

    return data > hoje ? { dataFutura: true } : null;
  }

  private formatarDataLocal(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  avancarParaRevisao(): void {
    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      return;
    }

    this.revisando = true;
  }

  voltarParaEdicao(): void {
    this.revisando = false;
  }

  formatarDataBrasileira(data: string | null): string {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-');

    return `${dia}/${mes}/${ano}`;
  }


  confirmarCadastro(): void {
    if (this.salvando || this.cadastroConcluido) return;

    if (this.formCadastro.invalid) {
      this.formCadastro.markAllAsTouched();
      this.revisando = false;
      return;
    }

    this.salvando = true;
    this.erroCadastro = '';

    const request = {
      alunos: this.formCadastro.getRawValue().alunos.map(aluno => ({
        nome: aluno.nome.trim(),
        dataNascimento: aluno.dataNascimento,
        turma: aluno.turma
      }))
    };

    this.responsavelService.createStudents(request).subscribe({
      next: () => {
        this.salvando = false;
        this.cadastroConcluido = true;
        this.revisando = false;
      },

      error: (error) => {
        console.error('Erro ao cadastrar alunos:', error);

        if (error.status === 400) {
          this.erroCadastro =
            'Os dados informados são inválidos. Revise as informações.';
        } else if (error.status === 401) {
          this.erroCadastro =
            'Sua sessão expirou. Faça login novamente.';
        } else if (error.status === 403) {
          this.erroCadastro =
            'Não foi possível autorizar o cadastro. Verifique sua sessão.';
        } else {
          this.erroCadastro =
            'Não foi possível cadastrar os alunos. Tente novamente.';
        }

        this.salvando = false;
      }
    });
  }

}

