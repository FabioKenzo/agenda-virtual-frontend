import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ResponsavelService } from '../../../core/services/responsavel.service';
import { Comunicado } from '../../../core/models/comunicado';

@Component({
  selector: 'app-comunicados-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './comunicados-lista.component.html',
  styleUrls: ['./comunicados-lista.component.css']
})
export class ComunicadosListaComponent implements OnInit {

  comunicados: Comunicado[] = [];

  paginaAtual = 0;
  tamanhoPagina = 9;
  totalPaginas = 0;
  totalComunicados = 0;

  carregando = false;
  erro = false;

  constructor(private responsavelService: ResponsavelService) {}

  ngOnInit(): void {
    this.carregarComunicados();
  }

  carregarComunicados(pagina: number = 0): void {

    if (this.carregando) {
      return;
    }

    this.carregando = true;
    this.erro = false;

    this.responsavelService
      .getComunicadosPaginados(pagina, this.tamanhoPagina)
      .subscribe({
        next: (resultado) => {
          this.comunicados = resultado.content;
          this.paginaAtual = resultado.number;
          this.totalPaginas = resultado.totalPages;
          this.totalComunicados = resultado.totalElements;
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar comunicados:', error);
          this.erro = true;
          this.carregando = false;
        }
      });
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 0) {
      this.carregarComunicados(this.paginaAtual - 1);
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.carregarComunicados(this.paginaAtual + 1);
    }
  }
}

