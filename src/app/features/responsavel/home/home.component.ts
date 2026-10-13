import { Component } from '@angular/core';
import { ResponsavelService } from '../../../core/services/responsavel.service';
import { Evento } from '../../../core/models/evento';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { Comunicado } from '../../../core/models/comunicado';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  eventos: Evento[] = [];
  carregandoEventos = false;
  erroEventos = false;

  comunicados: Comunicado[] = [];
  carregandoComunicados = false;
  erroComunicados = false;

  constructor(
    private responsavelService: ResponsavelService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.carregarEventos();
    this.carregarComunicados();
  }

  carregarEventos(): void {
    this.carregandoEventos = true;
    this.erroEventos = false;

    this.responsavelService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
        this.carregandoEventos = false;
      },

      error: (error) => {
        console.error('Erro ao buscar eventos:', error);

        this.erroEventos = true;
        this.carregandoEventos = false;
      }
    });
  }

  carregarComunicados(): void {
    this.carregandoComunicados = true;
    this.erroComunicados = false;

    this.responsavelService.getComunicados().subscribe({
      next: (comunicados) => {
        this.comunicados = comunicados;
        this.carregandoComunicados = false;
      },

      error: (error) => {
        console.error('Erro ao buscar comunicados:', error);

        this.erroComunicados = true;
        this.carregandoComunicados = false;
      }
    });
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro ao relizar logout: ', error);
      }
    });
  }
}
