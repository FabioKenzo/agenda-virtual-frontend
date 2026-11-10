import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MediaService } from '../../../core/services/media.service';
import { Media } from '../../../core/models/media';
import { AdminEventService } from '../../../core/services/admin-event.service';
import { EventRequest, EventStatus } from '../../../core/models/admin-event';




@Component({
  selector: 'app-evento-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './evento-form.component.html',
  styleUrl: './evento-form.component.css'

})
export class EventoFormComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly adminEventService = inject(AdminEventService);
  private readonly router = inject(Router);
  readonly mediaService = inject(MediaService);
  private readonly route = inject(ActivatedRoute);

  // Controle do modo de edição
  eventoId: number | null = null;
  modoEdicao = false;
  carregandoEvento = false;
  studentIds: number[] = [];
  eventoCarregado = false;


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

  // Cadastro de eventos
  salvandoEvento = false;
  erroCadastro = '';
  sucessoCadastro = '';
  exibindoSucesso = false;

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
    bannerMediaId: this.fb.control<number | null>(null),

    status: this.fb.nonNullable.control<EventStatus>(
      'AGENDADO',
      Validators.required
    )


  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam !== null) {
      const id = Number(idParam);

      if (Number.isSafeInteger(id) && id > 0) {
        this.eventoId = id;
        this.modoEdicao = true;

        if (Number.isSafeInteger(id) && id > 0) {
          this.eventoId = id;
          this.modoEdicao = true;

          this.carregarEvento();
        }
      }
    }

    this.carregarImagens();

    this.eventoForm.controls.bannerUrl.valueChanges.subscribe(
      (url: string) => {
        if (url.trim()) {
          this.eventoForm.controls.bannerMediaId.setValue(null);
        }
      }
    );
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



  selecionarImagem(imagem: Media): void {
    const imagemSelecionadaId =
      this.eventoForm.controls.bannerMediaId.value;

    if (imagemSelecionadaId === imagem.id) {
      this.eventoForm.patchValue({
        bannerMediaId: null
      });
      return;
    }

    this.eventoForm.patchValue({
      bannerMediaId: imagem.id,
      bannerUrl: ''
    });

    this.erroExclusao = '';
  }


  carregarEvento(): void {
    if (this.eventoId === null) {
      return;
    }

    this.carregandoEvento = true;
    this.erroCadastro = '';

    this.adminEventService.getEventoPorId(this.eventoId).subscribe({
      next: (evento) => {
        this.studentIds = evento.students.map(student => student.id);

        this.eventoForm.patchValue({
          titulo: evento.titulo,
          descricao: evento.descricao,
          data: evento.data,
          horaInicio: evento.horaInicio || '',
          horaFim: evento.horaFim || '',
          local: evento.local || '',
          observacoes: evento.observacoes || '',
          whatsappUrl: evento.whatsappUrl || '',
          bannerUrl: evento.bannerUrl || '',
          bannerMediaId: evento.bannerMediaId,
          status: evento.status
        });

        this.eventoCarregado = true;

        this.carregandoEvento = false;
      },
      error: (error) => {
        this.carregandoEvento = false;

        console.error('Erro ao carregar evento:', error);

        this.erroCadastro =
          error.error?.message || 'Não foi possível carregar o evento.';
      }
    });
  }


  salvarEvento(): void {
    if (this.salvandoEvento || this.exibindoSucesso) {
      return;
    }

    if (this.modoEdicao && !this.eventoCarregado) {
      this.erroCadastro = 'Aguarde o carregamento do evento antes de salvar.';
      return;
    }

    if (this.eventoForm.invalid) {
      this.eventoForm.markAllAsTouched();
      return;
    }

    const form = this.eventoForm.getRawValue();

    const request: EventRequest = {
      titulo: form.titulo,
      descricao: form.descricao,
      data: form.data,
      horaInicio: form.horaInicio || null,
      horaFim: form.horaFim || null,
      local: form.local || null,
      observacoes: form.observacoes || null,
      whatsappUrl: form.whatsappUrl || null,
      bannerUrl: form.bannerUrl || null,
      bannerMediaId: form.bannerMediaId,
      status: form.status,
      studentIds: this.studentIds
    };

    this.salvandoEvento = true;
    this.erroCadastro = '';
    this.sucessoCadastro = '';


    const requisicao = this.modoEdicao && this.eventoId !== null
      ? this.adminEventService.atualizarEvento(this.eventoId, request)
      : this.adminEventService.criarEvento(request);

    requisicao.subscribe({

      next: (evento) => {
        this.salvandoEvento = false;
        this.exibindoSucesso = true;

        this.sucessoCadastro = this.modoEdicao
          ? 'Evento atualizado com sucesso!'
          : 'Evento cadastrado com sucesso!';

        console.log('Evento salvo:', evento);

        setTimeout(() => {
          this.router.navigate(['/admin/eventos']);
        }, 1500);
      },

      error: (error) => {
        this.salvandoEvento = false;

        console.error('Erro ao salvar evento:', error);

        this.erroCadastro = error.error?.message ||
          (this.modoEdicao
            ? 'Não foi possível atualizar o evento.'
            : 'Não foi possível cadastrar o evento.');
      }
    });
    
  }
}
