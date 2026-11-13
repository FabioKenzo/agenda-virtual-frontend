import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsavelService } from '../../../core/services/responsavel.service';
import { Evento } from '../../../core/models/evento';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-eventos-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './eventos-lista.component.html',
  styleUrl: './eventos-lista.component.css'
})
export class EventosListaComponent implements OnInit {

  eventos: Evento[] = [];

  paginaAtual = 0;
  tamanhoPagina = 9;
  totalPaginas = 0;
  totalEventos = 0;

  carregando = false;
  erro = false;

  constructor(private responsavelService: ResponsavelService) {}

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(pagina: number = 0): void {

    if (this.carregando) {
      return;
    }

    this.carregando = true;
    this.erro = false;

    this.responsavelService
      .getEventosPaginados(pagina, this.tamanhoPagina)
      .subscribe({
        next: (resultado) => {
          this.eventos = resultado.content;
          this.paginaAtual = resultado.number;
          this.totalPaginas = resultado.totalPages;
          this.totalEventos = resultado.totalElements;
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar eventos:', error);
          this.erro = true;
          this.carregando = false;
        }
      });
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.carregarEventos(this.paginaAtual - 1);
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.carregarEventos(this.paginaAtual + 1);
    }
  }
}
