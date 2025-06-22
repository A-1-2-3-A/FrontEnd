<script setup>
import { ref, computed, onMounted } from 'vue'
import { usuarios } from '@/data/usuarios.js'

// --- ESTADO DEL COMPONENTE ---
const nombre = ref('')
const textoEstudiante = ref('')
const estudianteSeleccionado = ref(null)
const mostrarOpciones = ref(false)
const archivo = ref(null)
const fechaRegistro = ref('')

// --- LÓGICA DEL COMPONENTE ---
onMounted(() => {
    const ahora = new Date()
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    fechaRegistro.value = ahora.toLocaleDateString('es-ES', options);
})

const estudiantes = computed(() => usuarios.filter(u => u.rol === 'estudiante'));

const estudiantesFiltrados = computed(() => {
    const criterio = textoEstudiante.value.trim().toLowerCase();
    return estudiantes.value.filter(e =>
        `${e.nombres} ${e.primer_apellido} ${e.segundo_apellido}`.toLowerCase().includes(criterio)
    );
});

function seleccionarEstudiante(estudiante) {
    estudianteSeleccionado.value = estudiante;
    textoEstudiante.value = `${estudiante.primer_apellido} ${estudiante.segundo_apellido}, ${estudiante.nombres}`;
    mostrarOpciones.value = false;
}

function ocultarOpcionesConDelay() {
    setTimeout(() => { mostrarOpciones.value = false; }, 200);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        archivo.value = file;
    }
}

function registrarTema() {
    if (!nombre.value || !estudianteSeleccionado.value || !archivo.value) {
        alert('Nombre del tema, estudiante y archivo son requeridos.');
        return;
    }
    alert(`Registrando tema:\n- Nombre: ${nombre.value}\n- Estudiante: ${textoEstudiante.value}\n- Archivo: ${archivo.value.name}`);
}
</script>

<template>
    <section class="container mt-4">
        <form @submit.prevent="registrarTema" class="card shadow-sm w-100" style="max-width: 600px; margin: auto;">
            <div class="card-header bg-primary text-white fw-bold text-center">
                Registrar Nuevo Tema
            </div>
            <div class="card-body p-4">
                <div class="mb-3">
                    <label class="form-label">Nombre del Tema</label>
                    <input type="text" v-model="nombre" class="form-control" required />
                </div>

                <div class="mb-3 position-relative">
                    <label class="form-label">Seleccione Estudiante</label>
                    <input type="text" class="form-control" v-model="textoEstudiante" placeholder="Escriba para buscar..." @focus="mostrarOpciones = true" @blur="ocultarOpcionesConDelay" required />
                    <ul v-if="mostrarOpciones && estudiantesFiltrados.length" class="list-group position-absolute w-100" style="z-index: 10; max-height: 200px; overflow-y: auto;">
                        <li v-for="e in estudiantesFiltrados" :key="e.idUsuario" class="list-group-item list-group-item-action" style="cursor: pointer" @mousedown.prevent="seleccionarEstudiante(e)">
                            {{ e.primer_apellido }} {{ e.segundo_apellido }}, {{ e.nombres }}
                        </li>
                    </ul>
                </div>

                <!-- **SECCIÓN DE ARCHIVO CORREGIDA Y SIMPLIFICADA** -->
                <div class="mb-3">
                    <label for="fileUpload" class="form-label">Archivo del Tema (PDF)</label>
                    <div class="input-group">
                         <input type="file" class="form-control" @change="handleFileUpload" accept=".pdf" id="fileUpload" required>
                         <!-- El label nativo del input-group actúa como el botón "Examinar" -->
                    </div>
                     <small v-if="archivo" class="d-block text-success mt-1">Archivo seleccionado: {{ archivo.name }}</small>
                </div>

                <div class="row align-items-center">
                    <div class="col-md-6 mb-3">
                         <label class="form-label text-muted">Estado del Tema</label>
                         <div class="form-control-plaintext-custom">
                             <span class="badge text-bg-secondary">PRELIMINAR</span>
                         </div>
                    </div>
                     <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">Fecha de Registro</label>
                        <div class="form-control-plaintext-custom">
                            <i class="bi bi-calendar-event me-2"></i>{{ fechaRegistro }}
                        </div>
                    </div>
                </div>

                <div class="text-center mt-4 border-top pt-4">
                    <button type="submit" class="btn btn-success px-5">Registrar Tema</button>
                </div>
            </div>
        </form>
    </section>
</template>

<style scoped>
.form-control-plaintext-custom {
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: .375rem;
    background-color: #f8f9fa;
    font-size: 1rem;
    font-weight: 500;
    color: #212529;
}
</style>