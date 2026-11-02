import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MediaService } from '../../../core/services/media.service';
import { Media } from '../../../core/models/media';

@Component({
  selector: 'app-evento-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.css'
})
export class EventoFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  readonly mediaService = inject(MediaService);

  // Biblioteca de imagens
  imagens: Media[] = [];
  carregandoImagens = false;
  erroImagens = '';
  enviandoImagem = false;
  erroUpload = '';
  sucessoUpload = '';

  // Exclusão de imagens
  excluindoImagemId: number | null = null;
  erroExclusao = '';
  sucessoExclusao = '';


  // Formulário de cadastro de eventos
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

  ngOnInit(): void {
    this.carregarImagens();
  }

  private carregarImagens(): void {
    this.carregandoImagens = true;
    this.erroImagens = '';

    this.mediaService.listar().subscribe({
      next: (imagens: Media[]) => {
        this.imagens = imagens;
        this.carregandoImagens = false;
      },
      error: (error) => {
        console.error('Erro ao carregar imagens:', error);

        this.erroImagens =
          'Não foi possível carregar a biblioteca de imagens.';

        this.carregandoImagens = false;
      }
    });
  }


  enviarImagem(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];

    if (!arquivo) {
      return;
    }

    this.erroUpload = '';
    this.sucessoUpload = '';

    const formatosPermitidos = ['image/jpeg', 'image/png'];

    if (!formatosPermitidos.includes(arquivo.type)) {
      this.erroUpload = 'Selecione uma imagem JPG ou PNG.';
      input.value = '';
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      this.erroUpload = 'A imagem deve ter no máximo 5 MB.';
      input.value = '';
      return;
    }

    this.enviandoImagem = true;

    this.mediaService.upload(arquivo).subscribe({
      next: () => {
        this.enviandoImagem = false;
        this.sucessoUpload = 'Imagem enviada com sucesso!';
        input.value = '';

        this.carregarImagens();
      },
      error: (error) => {
        console.error('Erro ao enviar imagem:', error);

        this.erroUpload =
          error.error?.message || 'Não foi possível enviar a imagem.';

        this.enviandoImagem = false;
        input.value = '';
      }
    });
  }


  excluirImagem(imagem: Media): void {
    const confirmou = window.confirm(
      `Deseja realmente excluir a imagem "${imagem.originalFilename}"?`
    );

    if (!confirmou) {
      return;
    }

    if (this.excluindoImagemId !== null) {
      return;
    }

    this.erroExclusao = '';
    this.sucessoExclusao = '';
    this.excluindoImagemId = imagem.id;

    this.mediaService.excluir(imagem.id).subscribe({
      next: () => {
        this.imagens = this.imagens.filter(
          item => item.id !== imagem.id
        );

        this.sucessoExclusao = 'Imagem excluída com sucesso.';
        this.excluindoImagemId = null;
      },
      error: (error) => {
        console.error('Erro ao excluir imagem:', error);

        if (error.status === 409) {
          this.erroExclusao =
            'Esta imagem está vinculada a um evento e não pode ser excluída.';
        } else {
          this.erroExclusao =
            error.error?.message || 'Não foi possível excluir a imagem.';
        }

        this.excluindoImagemId = null;
      }
    });
  }



}
