import { Component, inject, OnInit } from '@angular/core';
import { AdminEventService } from '../../../core/services/admin-event.service';
import { AdminEvent } from '../../../core/models/admin-event';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-eventos',
  imports: [DatePipe],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit {

  private readonly adminEventService = inject(AdminEventService);

  eventos: AdminEvent[] = [];
  carregando = true;
  erro = '';

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.carregando = true;
    this.erro = '';

    this.adminEventService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.carregando = false;

        console.log('Eventos recebidos:', eventos);
      },
      error: (error) => {
        console.error('Erro ao carregar eventos:', error);

        this.erro = 'Não foi possível carregar os eventos.';
        this.carregando = false;
      }
    });
  }
}
