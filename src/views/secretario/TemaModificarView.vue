<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/axios.js';
import { useModalStore } from '@/stores/modal';

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const temaId = parseInt(route.params.id);

const isLoading = ref(true);
const isSaving = ref(false);

// Datos del formulario
const nombre = ref('');
const estudianteInfo = ref('');
const archivoActualNombre = ref('');
const archivoActualRuta = ref('');
const nuevoArchivo = ref(null);

// Cargar los datos del tema a modificar.
async function fetchTemaParaModificar() {
    isLoading.value = true;
    try {
        const response = await apiClient.get(`/temas/${temaId}`);
        const tema = response.data.data;

        // Solo se pueden modificar temas en estado PRELIMINAR.
        if (tema.estado_tema !== 'PRELIMINAR') {
            modalStore.showModal({ title: 'Acción no permitida', message: 'Solo se pueden modificar temas en estado PRELIMINAR.', type: 'error' });
            router.push({ name: 'STemaView' });
            return;
        }

        nombre.value = tema.nombre;
        estudianteInfo.value = tema.estudiante.nombreCompleto;

        // El nombre del archivo se encuentra en la primera versión del historial.
        if (tema.revisionesPorTribunal[0]?.historialCompleto[0]?.documentoEstudiante) {
            archivoActualNombre.value = tema.revisionesPorTribunal[0].historialCompleto[0].documentoEstudiante.nombre;
            archivoActualRuta.value = tema.revisionesPorTribunal[0].historialCompleto[0].documentoEstudiante.ruta;
        }

        console.log('archivoActualRuta:', archivoActualRuta.value);

    } catch (error) {
        console.error("Error al cargar el tema:", error);
        modalStore.showModal({ title: 'Error', message: 'No se pudo cargar la información del tema.', type: 'error' });
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchTemaParaModificar);


// Guardar los cambios en la API.
async function guardarCambios() {
    if (!nombre.value) {
        modalStore.showModal({ title: 'Error', message: 'El nombre del tema es requerido.', type: 'error' });
        return;
    }

    isSaving.value = true;

    // Usamos FormData porque podríamos estar enviando un archivo.
    const formData = new FormData();
    formData.append('nombre', nombre.value);

    // Solo añadimos el archivo al FormData si el usuario ha seleccionado uno nuevo.
    if (nuevoArchivo.value) {
        formData.append('archivo', nuevoArchivo.value);
    }

    try {
        // Axios permite enviar FormData con el método PUT.
        await apiClient.put(`/temas/${temaId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        modalStore.showModal({
            title: 'Éxito',
            message: 'Los cambios en el tema han sido guardados.',
            type: 'success'
        });
        router.push({ name: 'STemaView' });

    } catch (error) {
        modalStore.showModal({
            title: 'Error al Guardar',
            message: error.response?.data?.message || 'No se pudieron guardar los cambios.',
            type: 'error'
        });
    } finally {
        isSaving.value = false;
    }
}

// Función para manejar la selección de un nuevo archivo.
function handleFileUpload(event) {
    nuevoArchivo.value = event.target.files[0];
}

function obtenerUrlArchivo(ruta) {
    if (!ruta) return '';
    // Usar la dirección y puerto reales
    return `http://localhost:5050/${ruta.replace(/^\/+/, '')}`;
}
</script>

<template>
    <section class="container mt-4">
        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando tema...</p>
        </div>

        <form v-else @submit.prevent="guardarCambios" class="card shadow-sm w-100"
            style="max-width: 600px; margin: auto;">
            <div class="card-header bg-primary text-white fw-bold text-center">
                Modificar Tema
            </div>
            <div class="card-body p-4">
                <div class="mb-3">
                    <label class="form-label">Nombre del Tema</label>
                    <input type="text" v-model="nombre" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label class="form-label">Estudiante</label>
                    <input type="text" :value="estudianteInfo" class="form-control" disabled readonly />
                </div>

                <div class="mb-3">
                    <label class="form-label">Archivo del Tema (PDF)</label>
                    <div class="alert alert-info p-2">
                        <strong>Archivo actual:</strong>
                        <template v-if="archivoActualRuta">
                            <a :href="obtenerUrlArchivo(archivoActualRuta)" target="_blank" rel="noopener">
                                {{ archivoActualNombre || 'Ver archivo' }}
                            </a>
                        </template>
                        <template v-else>
                            No disponible
                        </template>
                    </div>
                    <label for="fileUpload" class="form-label text-muted small">Seleccione un nuevo archivo para
                        reemplazar el actual (opcional):</label>
                    <input id="fileUpload" type="file" class="form-control" @change="handleFileUpload" accept=".pdf">
                    <div v-if="nuevoArchivo" class="alert alert-success mt-2 p-2">
                        <strong>Nuevo archivo:</strong> {{ nuevoArchivo.name }}
                    </div>
                </div>

                <div class="text-center mt-4 border-top pt-4">
                    <button type="submit" class="btn btn-success px-5" :disabled="isSaving">
                        <span v-if="isSaving" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        <span v-else>Guardar Cambios</span>
                    </button>
                </div>
            </div>
        </form>
    </section>
</template>