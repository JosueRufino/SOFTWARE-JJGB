<template>
    <div>
      <!-- Botão para abrir o modal -->
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#listaEsperaModal"
      >
        Adicionar na Lista de Espera
      </button>
  
      <!-- Modal -->
      <div
        class="modal fade"
        id="listaEsperaModal"
        tabindex="-1"
        aria-labelledby="listaEsperaModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="listaEsperaModalLabel">Adicionar na Lista de Espera</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form @submit.prevent="adicionarNaListaEspera">
              <div class="modal-body">
                <!-- Dados do Livro -->
                <fieldset class="mb-3">
                  <legend>Dados do Livro</legend>
                  <div class="mb-3">
                    <label for="nomeLivro" class="form-label">Nome do Livro</label>
                    <input
                      type="text"
                      id="nomeLivro"
                      v-model="form.nomeLivro"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="isbn" class="form-label">ISBN</label>
                    <input
                      type="text"
                      id="isbn"
                      v-model="form.isbn"
                      class="form-control"
                      required
                    />
                  </div>
                </fieldset>
  
                <!-- Dados do Estudante -->
                <fieldset class="mb-3">
                  <legend>Dados do Estudante</legend>
                  <div class="mb-3">
                    <label for="numeroMatricula" class="form-label">Número de Matrícula</label>
                    <input
                      type="text"
                      id="numeroMatricula"
                      v-model="form.numeroMatricula"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="mb-3">
                    <label for="nomeEstudante" class="form-label">Nome do Estudante</label>
                    <input
                      type="text"
                      id="nomeEstudante"
                      v-model="form.nomeEstudante"
                      class="form-control"
                      required
                    />
                  </div>
                </fieldset>
              </div>
  
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">Adicionar na Lista de Espera</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        form: {
          nomeLivro: '',
          isbn: '',
          numeroMatricula: '',
          nomeEstudante: '',
        },
      };
    },
    methods: {
      adicionarNaListaEspera() {
        console.log('Dados da lista de espera:', this.form);
        alert('Adicionado na lista de espera com sucesso!');
        // Resetar o formulário
        this.form = {
          nomeLivro: '',
          isbn: '',
          numeroMatricula: '',
          nomeEstudante: '',
        };
        // Fechar o modal manualmente
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('listaEsperaModal')
        );
        modal.hide();
      },
    },
  };
  </script>
  