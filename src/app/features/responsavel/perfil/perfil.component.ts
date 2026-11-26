import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ResponsavelService } from '../../../core/services/responsavel.service';
import { PerfilResponsavel } from '../../../core/models/perfil-responsavel';
import { AlunoResponsavel } from '../../../core/models/aluno-responsavel';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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

  modalEdicaoAberto = false;
  salvandoPerfil = false;
  erroEdicao = '';
  sucessoEdicao = false;

  private readonly fb = inject(FormBuilder);

  formEdicao = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(100)]],
    telefone: ['', [Validators.maxLength(20)]],
    senhaAtual: ['', [Validators.required]]
  });

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
      this.formEdicao.controls.nome.setErrors({ required: true });
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
        console.error('Erro ao atualizar perfil:', error);

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

  constructor(
    private responsavelService: ResponsavelService
  ) { }

  ngOnInit(): void {
    this.carregarDados();
  }

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
        console.error('Erro ao carregar perfil do responsável:', error);
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}