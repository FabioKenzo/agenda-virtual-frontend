import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evento-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.css'
})
export class EventoFormComponent {

  private readonly fb = inject(FormBuilder);

  eventoForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    descricao: ['', Validators.required],
    data: ['', Validators.required],
    horaInicio: [''],
    horaFim: [''],
    local: ['', Validators.maxLength(150)],
    observacoes: [''],
    whatsappUrl: ['', Validators.maxLength(500)],
    bannerUrl: ['', Validators.maxLength(500)],
    status: ['AGENDADO' as const, Validators.required]
  });

}