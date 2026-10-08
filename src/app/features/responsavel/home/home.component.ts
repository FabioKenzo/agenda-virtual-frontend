import { Component } from '@angular/core';
import { ResponsavelService } from '../../../core/services/responsavel.service';
import { Evento } from '../../../core/models/evento';
import { AuthService } from '../../../core/services/auth.service';
import { Route, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {

  eventos: Evento[] = [];

  constructor(
    private responsavelService: ResponsavelService, 
    private authService: AuthService, 
    private router: Router) { }

  ngOnInit(): void {
    this.carregarEventos();
  }

  carregarEventos(): void {
    this.responsavelService.getEventos().subscribe({
      next: (eventos) => {
        this.eventos = eventos;
      },

      error: (error) => {
        console.error('Erro ao buscar eventos: ', error);
      }

    })
  }

  onLogout(): void{
    this.authService.logout().subscribe({
      next:() => {
         this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erro ao relizar logout: ', error);
      }
    });
  }
}
