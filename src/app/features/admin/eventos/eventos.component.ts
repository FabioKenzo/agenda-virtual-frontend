import { Component, inject, OnInit } from '@angular/core';
import { AdminEventService } from '../../../core/services/admin-event.service';
import { AdminEvent } from '../../../core/models/admin-event';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-eventos',
  imports: [DatePipe, RouterLink],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit {

  private readonly adminEventService = inject(AdminEventService);

  eventos: AdminEvent[] = [];
  carregando = true;
  erro = '';
  eventoParaExcluir: AdminEvent | null = null;
  excluindoEvento = false;
  erroExclusao = '';
  sucessoExclusao = '';

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

  abrirModalExclusao(evento: AdminEvent): void {
    this.eventoParaExcluir = evento;
    this.erroExclusao = '';
    this.sucessoExclusao = '';
  }

  fecharModalExclusao(): void {
    if (this.excluindoEvento) {
      return;
    }

    this.eventoParaExcluir = null;
    this.erroExclusao = '';
  }


  confirmarExclusao(): void {
    if (!this.eventoParaExcluir || this.excluindoEvento) {
      return;
    }

    const eventoId = this.eventoParaExcluir.id;

    this.excluindoEvento = true;
    this.erroExclusao = '';

    this.adminEventService.excluirEvento(eventoId).subscribe({
      next: () => {
        this.eventos = this.eventos.filter(
          evento => evento.id !== eventoId
        );

        this.excluindoEvento = false;
        this.eventoParaExcluir = null;
        this.sucessoExclusao = 'Evento excluído com sucesso!';

        console.log('Evento excluído com sucesso:', eventoId);
      },
      error: (error) => {
        console.error('Erro ao excluir evento:', error);

        this.erroExclusao =
          error.error?.message ||
          'Não foi possível excluir o evento. Tente novamente.';

        this.excluindoEvento = false;
      }
    });
  }

}
