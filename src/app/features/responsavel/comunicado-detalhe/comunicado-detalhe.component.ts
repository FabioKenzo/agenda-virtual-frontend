
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { ResponsavelService } from '../../../core/services/responsavel.service';
import { Comunicado } from '../../../core/models/comunicado';

@Component({
  selector: 'app-comunicado-detalhe',
  imports: [DatePipe, RouterLink],
  templateUrl: './comunicado-detalhe.component.html',
  styleUrl: './comunicado-detalhe.component.css'
})
export class ComunicadoDetalheComponent implements OnInit {

  comunicado: Comunicado | null = null;
  carregando = true;
  erro = false;

  constructor(
    private route: ActivatedRoute,
    private responsavelService: ResponsavelService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isSafeInteger(id) || id <= 0) {
      this.erro = true;
      this.carregando = false;
      return;
    }

    this.responsavelService.getComunicadoPorId(id).subscribe({
      next: (comunicado) => {
        this.comunicado = comunicado;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao buscar comunicado:', error);
        this.erro = true;
        this.carregando = false;
      }
    });
  }
}

