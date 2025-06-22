<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'
import { useModalStore } from '@/stores/modal'

const route = useRoute()
const router = useRouter()
const modalStore = useModalStore()
const temaId = parseInt(route.params.id)

// --- ESTADO DEL COMPONENTE ---
const temaActual = ref(null)
const nombre = ref('')
const estudianteSeleccionado = ref(null)
const archivoActual = ref(null)
const nuevoArchivo = ref(null)

// --- LÓGICA DEL COMPONENTE ---
onMounted(() => {
    // Cargar los datos del tema a modificar
    temaActual.value = temas.find(t => t.idTema === temaId);

    if (temaActual.value) {
        nombre.value = temaActual.value.nombre;
        estudianteSeleccionado.value = usuarios.find(u => u.idUsuario === temaActual.value.idEstudiante);
        archivoActual.value = { name: temaActual.value.archivo }; // Simular un objeto File
    }
});

function handleFileUpload(event) {
    nuevoArchivo.value = event.target.files[0];
}

function guardarCambios() {
    if (!nombre.value || !estudianteSeleccionado.value) {
        modalStore.showModal({ title: 'Error', message: 'El nombre del tema y el estudiante son requeridos.', type: 'error' });
        return;
    }
    
    modalStore.showModal({
        title: 'Éxito',
        message: 'Los cambios en el tema han sido guardados.',
        type: 'success'
    });
    router.push({ name: 'STemaView' });
}
</script>

<template>
    <section class="container mt-4">
        <form @submit.prevent="guardarCambios" class="card shadow-sm w-100" style="max-width: 600px; margin: auto;">
            <div class="card-header bg-primary text-white fw-bold text-center">
                Modificar Tema
            </div>
            <div v-if="temaActual" class="card-body p-4">
                <div class="mb-3">
                    <label class="form-label">Nombre del Tema</label>
                    <input type="text" v-model="nombre" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label class="form-label">Estudiante</label>
                    <!-- En una app real, aquí iría el mismo selector de estudiante que en "Añadir" -->
                    <input type="text" :value="`${estudianteSeleccionado?.primer_apellido} ${estudianteSeleccionado?.segundo_apellido}, ${estudianteSeleccionado?.nombres}`" class="form-control" disabled />
                </div>

                <div class="mb-3">
                    <label class="form-label">Archivo del Tema (PDF)</label>
                    <div class="alert alert-info p-2">
                        <strong>Archivo actual:</strong> {{ archivoActual?.name }}
                    </div>
                    <label for="fileUpload" class="form-label text-muted small">Seleccione un nuevo archivo para reemplazar el actual (opcional):</label>
                    <input id="fileUpload" type="file" class="form-control" @change="handleFileUpload" accept=".pdf">
                    <div v-if="nuevoArchivo" class="alert alert-success mt-2 p-2">
                        <strong>Nuevo archivo:</strong> {{ nuevoArchivo.name }}
                    </div>
                </div>

                <div class="text-center mt-4 border-top pt-4">
                    <button type="submit" class="btn btn-success px-5">Guardar Cambios</button>
                </div>
            </div>
            <div v-else class="alert alert-danger">
                No se encontró el tema a modificar o no tiene permiso para editarlo.
            </div>
        </form>
    </section>
</template>