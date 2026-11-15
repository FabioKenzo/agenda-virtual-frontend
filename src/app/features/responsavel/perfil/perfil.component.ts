import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { ResponsavelService } from '../../../core/services/responsavel.service';
import { PerfilResponsavel } from '../../../core/models/perfil-responsavel';
import { AlunoResponsavel } from '../../../core/models/aluno-responsavel';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  perfil: PerfilResponsavel | null = null;
  alunos: AlunoResponsavel[] = [];

  carregando = false;
  erro = false;

  constructor(private responsavelService: ResponsavelService) {}

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