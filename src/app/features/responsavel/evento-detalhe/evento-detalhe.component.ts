import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ResponsavelService } from '../../../core/services/responsavel.service';
import { Evento } from '../../../core/models/evento';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-evento-detalhe',
  imports: [RouterLink, DatePipe],
  templateUrl: './evento-detalhe.component.html',
  styleUrl: './evento-detalhe.component.css'
})
export class EventoDetalheComponent implements OnInit {

  evento: Evento | null = null;
  carregando = true;
  erro = false;

  constructor(
    private route: ActivatedRoute,
    private responsavelService: ResponsavelService
  ) {}

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.responsavelService.getEventoPorId(id).subscribe({
      next: (evento) => {
        this.evento = evento;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao buscar evento:', error);
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}
