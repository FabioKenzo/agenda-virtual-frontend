import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminComunicadoService } from '../../../core/services/admin-comunicado.service';
import { Comunicado } from '../../../core/models/comunicado';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './comunicados.component.html',
  styleUrl: './comunicados.component.css'
})
export class ComunicadosComponent implements OnInit {

  private readonly comunicadoService = inject(AdminComunicadoService);

  comunicados: Comunicado[] = [];
  carregando = true;
  erro = '';

  comunicadoParaExcluir: Comunicado | null = null;
  excluindoComunicado = false;
  erroExclusao = '';
  sucessoExclusao = '';

  ngOnInit(): void {
    this.carregarComunicados();
  }

  carregarComunicados(): void {
    this.carregando = true;
    this.erro = '';

    this.comunicadoService.getComunicados().subscribe({
      next: (comunicados) => {
        this.comunicados = comunicados;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar comunicados:', error);

        this.erro = 'Não foi possível carregar os comunicados.';
        this.carregando = false;
      }
    });
  }

  abrirModalExclusao(comunicado: Comunicado): void {
    this.comunicadoParaExcluir = comunicado;
    this.erroExclusao = '';
    this.sucessoExclusao = '';
  }

  fecharModalExclusao(): void {
    if (this.excluindoComunicado) {
      return;
    }

    this.comunicadoParaExcluir = null;
    this.erroExclusao = '';
  }

  confirmarExclusao(): void {
    if (!this.comunicadoParaExcluir || this.excluindoComunicado) {
      return;
    }

    const comunicadoId = this.comunicadoParaExcluir.id;

    this.excluindoComunicado = true;
    this.erroExclusao = '';

    this.comunicadoService.excluirComunicado(comunicadoId).subscribe({
      next: () => {
        this.comunicados = this.comunicados.filter(
          comunicado => comunicado.id !== comunicadoId
        );

        this.excluindoComunicado = false;
        this.comunicadoParaExcluir = null;
        this.sucessoExclusao = 'Comunicado excluído com sucesso!';
      },
      error: (error) => {
        console.error('Erro ao excluir comunicado:', error);

        this.erroExclusao =
          error.error?.message ||
          'Não foi possível excluir o comunicado. Tente novamente.';

        this.excluindoComunicado = false;
      }
    });
  }
}

