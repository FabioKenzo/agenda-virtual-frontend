import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResponsavelService } from '../../../core/services/responsavel.service';
import { PerfilResponsavel } from '../../../core/models/perfil-responsavel';
import { AlunoResponsavel } from '../../../core/models/aluno-responsavel';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  perfil: PerfilResponsavel | null = null;
  alunos: AlunoResponsavel[] = [];

  carregando = false;
  erro = false;

  // Edição do perfil
  modalEdicaoAberto = false;
  salvandoPerfil = false;
  erroEdicao = '';
  sucessoEdicao = false;

  // Edição dos alunos
  modalAlunoAberto = false;
  alunoEmEdicao: AlunoResponsavel | null = null;

  confirmandoEdicaoAluno = false;
  salvandoAluno = false;
  erroEdicaoAluno = '';
  sucessoEdicaoAluno = false;

  readonly turmas = ['G1', 'G2', 'G3', 'G4', 'G5'];

  readonly dataMaxima = this.formatarDataLocal(new Date());

  private readonly fb = inject(FormBuilder);


  salvarAluno(): void {
    if (this.salvandoAluno || !this.alunoEmEdicao) return;

    if (!this.confirmandoEdicaoAluno) return;

    const { nome, dataNascimento, turma, senhaAtual } =
      this.formEdicaoAluno.getRawValue();

    const nomeNormalizado = nome.trim();

    if (
      !nomeNormalizado ||
      this.formEdicaoAluno.controls.nome.invalid ||
      !dataNascimento ||
      dataNascimento > this.dataMaxima ||
      this.formEdicaoAluno.controls.turma.invalid
    ) {
      this.voltarEdicaoAluno();
      this.formEdicaoAluno.markAllAsTouched();
      return;
    }

    if (!senhaAtual.trim()) {
      this.formEdicaoAluno.controls.senhaAtual.markAsTouched();
      return;
    }

    this.salvandoAluno = true;
    this.erroEdicaoAluno = '';

    this.responsavelService.updateAluno(
      this.alunoEmEdicao.id,
      {
        nome: nomeNormalizado,
        dataNascimento,
        turma,
        senhaAtual
      }
    ).subscribe({
      next: (alunoAtualizado) => {
        this.alunos = this.alunos.map(aluno =>
          aluno.id === alunoAtualizado.id ? alunoAtualizado : aluno
        );

        this.salvandoAluno = false;
        this.fecharModalAluno();
        this.sucessoEdicaoAluno = true;
      },
      error: (error) => {
        console.error('Erro ao atualizar aluno:', error);

        const mensagemBackend = error.error?.message;

        if (
          error.status === 400 &&
          mensagemBackend === 'Senha atual incorreta.'
        ) {
          this.erroEdicaoAluno =
            'Senha atual incorreta. Verifique e tente novamente.';
        } else if (error.status === 400) {
          this.erroEdicaoAluno =
            'Confira os dados informados e tente novamente.';
        } else if (error.status === 401) {
          this.erroEdicaoAluno =
            'Sua autenticação expirou. Faça login novamente.';
        } else if (error.status === 403) {
          this.erroEdicaoAluno =
            'Você não tem permissão para realizar esta alteração.';
        } else if (error.status === 404) {
          this.erroEdicaoAluno =
            'Aluno não encontrado. Atualize a página e tente novamente.';
        } else {
          this.erroEdicaoAluno =
            'Não foi possível salvar as alterações. Tente novamente.';
        }

        this.formEdicaoAluno.controls.senhaAtual.setValue('');
        this.salvandoAluno = false;
      }
    });
  }


  // Formulário de edição do perfil
  formEdicao = this.fb.group({
    nome: ['', [
      Validators.required,
      Validators.maxLength(100)
    ]],
    telefone: ['', [
      Validators.maxLength(20)
    ]],
    senhaAtual: ['', [
      Validators.required
    ]]
  });

  // Formulário de edição do aluno
  formEdicaoAluno = this.fb.nonNullable.group({
    nome: ['', [
      Validators.required,
      Validators.maxLength(100),
      Validators.pattern(/.*\S.*/)
    ]],
    dataNascimento: ['', [
      Validators.required
    ]],
    turma: ['', [
      Validators.required,
      Validators.pattern(/^G[1-5]$/)
    ]],
    senhaAtual: ['']
  });

  constructor(
    private responsavelService: ResponsavelService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

  // CARREGAMENTO DOS DADOS


  carregarDados(): void {
    if (this.carregando) return;

    this.carregando = true;
    this.erro = false;

    forkJoin({
      perfil: this.responsavelService.getPerfil(),
      alunos: this.responsavelService.getAlunos()
    }).subscribe({
      next: ({ perfil, alunos }) => {
        this.perfil = perfil;
        this.alunos = alunos;
        this.carregando = false;
      },
      error: (error) => {
        console.error(
          'Erro ao carregar perfil do responsável:',
          error
        );

        this.erro = true;
        this.carregando = false;
      }
    });
  }

  // EDIÇÃO DO PERFIL


  abrirModalEdicao(): void {
    this.sucessoEdicao = false;

    if (!this.perfil) return;

    this.formEdicao.reset({
      nome: this.perfil.nome,
      telefone: this.perfil.telefone ?? '',
      senhaAtual: ''
    });

    this.modalEdicaoAberto = true;
  }

  fecharModalEdicao(): void {
    if (this.salvandoPerfil) return;

    this.modalEdicaoAberto = false;
    this.erroEdicao = '';
    this.formEdicao.reset();
  }

  salvarPerfil(): void {
    if (this.salvandoPerfil) return;

    if (this.formEdicao.invalid) {
      this.formEdicao.markAllAsTouched();
      return;
    }

    const { nome, telefone, senhaAtual } =
      this.formEdicao.getRawValue();

    const nomeNormalizado = (nome ?? '').trim();

    if (!nomeNormalizado) {
      this.formEdicao.controls.nome.setErrors({
        required: true
      });

      this.formEdicao.controls.nome.markAsTouched();
      return;
    }

    this.salvandoPerfil = true;
    this.erroEdicao = '';

    this.responsavelService.updatePerfil({
      nome: nomeNormalizado,
      telefone: telefone?.trim() || null,
      senhaAtual: senhaAtual ?? ''
    }).subscribe({
      next: (perfilAtualizado) => {
        this.perfil = perfilAtualizado;
        this.salvandoPerfil = false;

        this.fecharModalEdicao();
        this.sucessoEdicao = true;
      },
      error: (error) => {
        console.error(
          'Erro ao atualizar perfil:',
          error
        );

        const mensagemBackend = error.error?.message;

        if (
          error.status === 400 &&
          mensagemBackend === 'Senha atual incorreta.'
        ) {
          this.erroEdicao =
            'Senha atual incorreta. Verifique sua senha e tente novamente.';
        } else if (error.status === 400) {
          this.erroEdicao =
            'Confira os dados informados e tente novamente.';
        } else if (error.status === 401) {
          this.erroEdicao =
            'Sua autenticação expirou. Faça login novamente.';
        } else {
          this.erroEdicao =
            'Não foi possível salvar as alterações. Tente novamente.';
        }

        this.salvandoPerfil = false;
      }
    });
  }

  // EDIÇÃO DOS ALUNOS

  abrirModalAluno(aluno: AlunoResponsavel): void {
    this.alunoEmEdicao = aluno;

    this.formEdicaoAluno.reset({
      nome: aluno.nome,
      dataNascimento: aluno.dataNascimento ?? '',
      turma: aluno.turma ?? '',
      senhaAtual: ''
    });

    this.confirmandoEdicaoAluno = false;
    this.erroEdicaoAluno = '';
    this.sucessoEdicaoAluno = false;

    this.modalAlunoAberto = true;
  }

  avancarConfirmacaoAluno(): void {
    const { nome, dataNascimento, turma } =
      this.formEdicaoAluno.getRawValue();

    if (
      !nome.trim() ||
      !dataNascimento ||
      !turma ||
      this.formEdicaoAluno.controls.nome.invalid ||
      this.formEdicaoAluno.controls.turma.invalid ||
      dataNascimento > this.dataMaxima
    ) {
      this.formEdicaoAluno.markAllAsTouched();
      return;
    }

    this.erroEdicaoAluno = '';
    this.confirmandoEdicaoAluno = true;
  }

  voltarEdicaoAluno(): void {
    if (this.salvandoAluno) return;

    this.confirmandoEdicaoAluno = false;

    this.formEdicaoAluno.controls.senhaAtual.setValue('');
    this.erroEdicaoAluno = '';
  }

  fecharModalAluno(): void {
    if (this.salvandoAluno) return;

    this.modalAlunoAberto = false;
    this.confirmandoEdicaoAluno = false;
    this.alunoEmEdicao = null;
    this.erroEdicaoAluno = '';

    this.formEdicaoAluno.reset();
  }

  // MÉTODOS AUXILIARES

  private formatarDataLocal(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }
}
