import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { AdminComunicadoService } from '../../../core/services/admin-comunicado.service';
import { ComunicadoRequest } from '../../../core/models/comunicado';

@Component({
  selector: 'app-comunicado-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './comunicado-form.component.html',
  styleUrl: './comunicado-form.component.css'
})
export class ComunicadoFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly comunicadoService = inject(AdminComunicadoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  comunicadoId: number | null = null;
  modoEdicao = false;
  carregandoComunicado = false;
  comunicadoCarregado = false;

  salvandoComunicado = false;
  erroCadastro = '';
  sucessoCadastro = '';
  exibindoSucesso = false;

  comunicadoForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(150)]],
    conteudo: ['', Validators.required],
    ativo: [true, Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      const id = Number(idParam);

      if (!Number.isSafeInteger(id) || id <= 0) {
        this.erroCadastro = 'Identificador do comunicado inválido.';
        return;
      }

      this.comunicadoId = id;
      this.modoEdicao = true;
      this.carregarComunicado();
    }
  }

  carregarComunicado(): void {
    if (this.comunicadoId === null) {
      return;
    }

    this.carregandoComunicado = true;
    this.erroCadastro = '';

    this.comunicadoService
      .getComunicadoPorId(this.comunicadoId)
      .subscribe({
        next: (comunicado) => {
          this.comunicadoForm.patchValue({
            titulo: comunicado.titulo,
            conteudo: comunicado.conteudo,
            ativo: comunicado.ativo
          });

          this.comunicadoCarregado = true;
          this.carregandoComunicado = false;
        },
        error: (error) => {
          console.error('Erro ao carregar comunicado:', error);

          this.erroCadastro =
            error.error?.message ||
            'Não foi possível carregar o comunicado.';

          this.carregandoComunicado = false;
        }
      });
  }

  salvarComunicado(): void {
    if (this.salvandoComunicado || this.exibindoSucesso) {
      return;
    }

    if (this.modoEdicao && !this.comunicadoCarregado) {
      this.erroCadastro =
        'Aguarde o carregamento do comunicado antes de salvar.';
      return;
    }

    if (this.comunicadoForm.invalid) {
      this.comunicadoForm.markAllAsTouched();
      return;
    }

    const form = this.comunicadoForm.getRawValue();

    const request: ComunicadoRequest = {
      titulo: form.titulo.trim(),
      conteudo: form.conteudo.trim(),
      ativo: form.ativo
    };

    if (!request.titulo || !request.conteudo) {
      this.erroCadastro = 'Preencha o título e o conteúdo do comunicado.';
      return;
    }

    this.salvandoComunicado = true;
    this.erroCadastro = '';
    this.sucessoCadastro = '';

    const requisicao =
      this.modoEdicao && this.comunicadoId !== null
        ? this.comunicadoService.atualizarComunicado(
            this.comunicadoId,
            request
          )
        : this.comunicadoService.criarComunicado(request);

    requisicao.subscribe({
      next: () => {
        this.salvandoComunicado = false;
        this.exibindoSucesso = true;

        this.sucessoCadastro = this.modoEdicao
          ? 'Comunicado atualizado com sucesso!'
          : 'Comunicado cadastrado com sucesso!';

        this.router.navigate(['/admin/comunicados']);
      },
      error: (error) => {
        console.error('Erro ao salvar comunicado:', error);

        this.salvandoComunicado = false;

        this.erroCadastro =
          error.error?.message ||
          (this.modoEdicao
            ? 'Não foi possível atualizar o comunicado.'
            : 'Não foi possível cadastrar o comunicado.');
      }
    });
  }
}

