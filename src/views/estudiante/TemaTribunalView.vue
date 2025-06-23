<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/axios.js';
import { useModalStore } from '@/stores/modal';

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const temaId = parseInt(route.params.temaId);
const tribunalId = parseInt(route.params.id);

const tema = ref(null);
const isLoading = ref(true);
const revisionSeleccionadaId = ref(null); // ID de la VersionesTema

/// Retroalimentación de la versión seleccionada
const comentariosTribunal = ref([]);
const archivosRetroalimentacion = ref([]);

// Formulario para nueva corrección
const archivoCorreccion = ref(null);
const comentariosEstudiante = ref('');

// Encuentra la asignación y el historial correspondientes a este tribunal.
const miAsignacion = computed(() => {
    if (!tema.value) return null;
    return tema.value.revisionesPorTribunal.find(r => r.idTribunal === tribunalId);
});

// Devuelve el objeto de la revisión/versión que se está visualizando.
const revisionVisualizada = computed(() => {
    if (!miAsignacion.value || !revisionSeleccionadaId.value) return null;
    return miAsignacion.value.historialCompleto.find(h => h.id === revisionSeleccionadaId.value);
});

// Determina si el estudiante debe enviar una nueva versión.
const requiereAccion = computed(() => {
    if (!miAsignacion.value) return false;
    // La acción es requerida si el último veredicto del tribunal fue 'REVISADO'.
    return miAsignacion.value.veredictoActual === 'REVISADO';
});

// Carga los datos principales del tema.
async function fetchData() {
    isLoading.value = true;
    try {
        const response = await apiClient.get(`/temas/${temaId}`);
        tema.value = response.data.data;

        if (miAsignacion.value && miAsignacion.value.historialCompleto.length > 0) {
            const ultimaVersion = miAsignacion.value.historialCompleto[miAsignacion.value.historialCompleto.length - 1];
            revisionSeleccionadaId.value = ultimaVersion.id;
        }
    } catch (error) {
        console.error("Error al obtener detalle del tema:", error);
    } finally {
        isLoading.value = false;
    }
}

// Carga los comentarios y archivos para una versión específica.
async function fetchRetroalimentacion(idVersion) {
    if (!idVersion || !miAsignacion.value) return;
    try {
        const res = await apiClient.get(`/retroalimentaciones/${miAsignacion.value.idAsignacion}?id_version_tema=${idVersion}`);
        comentariosTribunal.value = res.data.data.comentarios;
        archivosRetroalimentacion.value = res.data.data.archivos;
    } catch (error) {
        console.error("Error al cargar retroalimentación:", error);
        comentariosTribunal.value = [];
        archivosRetroalimentacion.value = [];
    }
}

// Función de descarga de archivos.
async function descargarArchivo(ruta, nombre) {
    try {
        const response = await apiClient.get(`/archivos/descargar?ruta=${ruta}`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nombre);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        modalStore.showModal({ title: 'Error', message: 'No se pudo descargar el archivo.', type: 'error' });
    }
}

// Lógica para enviar una nueva corrección.
function handleFileUpload(event) {
    archivoCorreccion.value = event.target.files[0];
}

async function enviarCorreccion() {
    if (!archivoCorreccion.value) {
        modalStore.showModal({ title: 'Error', message: 'Por favor, seleccione un archivo PDF.', type: 'error' });
        return;
    }

    const formData = new FormData();
    formData.append('id_asignacion', miAsignacion.value.idAsignacion);
    formData.append('comentarios_estudiante', comentariosEstudiante.value);
    formData.append('archivo', archivoCorreccion.value);

    try {
        await apiClient.post('/versiones', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        modalStore.showModal({ title: 'Éxito', message: 'Tu corrección ha sido enviada.', type: 'success' });
        // Redirigir a la vista general de temas del estudiante.
        router.push({ name: 'ETemaView' });
    } catch (error) {
        modalStore.showModal({ title: 'Error', message: error.response?.data?.message || 'No se pudo enviar la corrección.', type: 'error' });
    }
}

onMounted(fetchData);

watch(revisionSeleccionadaId, (newId) => {
    if (newId) {
        fetchRetroalimentacion(newId);
    }
});

const getVeredictoClass = (veredicto) => {
    switch (veredicto) {
        case 'APROBADO': return 'badge bg-success';
        case 'REPROBADO': return 'badge bg-danger';
        case 'REVISADO': return 'badge bg-warning text-dark';
        default: return 'badge bg-secondary';
    }
};
</script>
<template>
    <section class="container mt-4">
        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando datos de la revisión...</p>
        </div>

        <div v-else-if="tema && miAsignacion">
            <h2 class="fw-bold text-center mb-4">Detalle de Revisión</h2>

            <div class="revision-bar card card-body mb-4">
                <div class="row w-100 align-items-center text-center">
                    <div class="col-md-5">
                        <span class="fw-semibold">Tribunal:</span> {{ miAsignacion.nombreCompleto }}
                    </div>
                    <div class="col-md-3">
                        <span class="fw-semibold">Veredicto:</span> <span
                            :class="getVeredictoClass(revisionVisualizada?.veredicto)">{{ revisionVisualizada?.veredicto
                            }}</span>
                    </div>
                    <div class="col-md-4 d-flex justify-content-center align-items-center">
                        <label for="revisionSelect" class="form-label mb-0 me-2 fw-semibold">Ver Intento:</label>
                        <select id="revisionSelect" class="form-select form-select-sm w-auto"
                            v-model="revisionSeleccionadaId">
                            <option v-for="r in miAsignacion.historialCompleto" :key="r.id" :value="r.id">
                                Revisión #{{ r.version }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <div v-if="revisionVisualizada" class="row g-4">
                <div class="col-lg-6 d-flex flex-column gap-4">
                    <div class="card shadow-sm">
                        <div class="card-header fw-bold bg-primary text-white">Mi Envío</div>
                        <div class="card-body">
                            <label class="form-label fw-semibold">Documento enviado:</label>
                            <div class="archivo-display">
                                <i class="bi bi-file-earmark-pdf-fill"></i>
                                <span>{{ revisionVisualizada.documentoEstudiante.nombre }}</span>
                                <a href="#"
                                    @click.prevent="descargarArchivo(revisionVisualizada.documentoEstudiante.ruta, revisionVisualizada.documentoEstudiante.nombre)"
                                    class="btn btn-sm btn-outline-secondary ms-auto">Descargar</a>
                            </div>

                            <div v-if="revisionVisualizada.documentoEstudiante.comentarios"
                                class="mt-3 border-top pt-3">
                                <label class="form-label fw-semibold">Mis Comentarios en este Envío:</label>
                                <p class="text-muted fst-italic">"{{ revisionVisualizada.documentoEstudiante.comentarios
                                }}"</p>
                            </div>

                            <div v-if="requiereAccion" class="mt-4 border-top pt-3">
                                <h6 class="text-success fw-bold">Acción Requerida</h6>
                                <p class="small text-muted mb-2">El tribunal ha solicitado correcciones. Sube una nueva
                                    versión de tu documento.</p>
                                <div class="mb-3">
                                    <label class="form-label">Archivo Corregido (PDF):</label>
                                    <input type="file" class="form-control" @change="handleFileUpload" accept=".pdf">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Comentarios para el Tribunal (Opcional):</label>
                                    <textarea class="form-control" rows="3" v-model="comentariosEstudiante"
                                        placeholder="Ej: He aplicado las correcciones solicitadas..."></textarea>
                                </div>
                                <button class="btn btn-success w-100 mt-2" @click="enviarCorreccion"
                                    :disabled="!archivoCorreccion">Enviar Corrección</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 d-flex flex-column gap-4">
                    <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold bg-secondary text-white">Observaciones del Tribunal</div>
                        <div class="card-body card-body-scrollable">
                            <p v-if="!revisionVisualizada.observaciones" class="text-muted text-center pt-3">No hay
                                observaciones.</p>
                            <p v-else style="white-space: pre-wrap;">{{ revisionVisualizada.observaciones }}</p>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold">Comentarios del Tribunal</div>
                        <div class="card-body card-body-scrollable">
                            <p v-if="!comentariosTribunal.length" class="text-muted text-center pt-3">No hay
                                comentarios.</p>
                            <ul v-else class="list-unstyled">
                                <li v-for="comment in comentariosTribunal" :key="comment.id"
                                    class="mb-2 border-bottom pb-2">
                                    <small class="text-muted d-block">{{ new
                                        Date(comment.fecha_publicacion).toLocaleString('es-ES') }}</small>
                                    <p class="mb-0">{{ comment.texto_comentario }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold">Archivos de Retroalimentación</div>
                        <div class="card-body">
                            <p v-if="!archivosRetroalimentacion.length" class="text-muted text-center pt-3">No hay
                                archivos.</p>
                            <ul v-else class="list-unstyled mb-0">
                                <li v-for="file in archivosRetroalimentacion" :key="file.id"
                                    class="archivo-display-retro">
                                    <i class="bi bi-file-earmark-arrow-down"></i>
                                    <span>{{ file.nombre }}</span>
                                    <a href="#"
                                        @click.prevent="descargarArchivo(file.archivo_retroalimentacion_ruta, file.nombre)"
                                        class="btn btn-sm btn-outline-secondary ms-auto">Descargar</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else-if="!isLoading" class="alert alert-danger text-center">
            No se pudo encontrar la información de la revisión.
        </div>
    </section>
</template>

<style scoped>
.revision-bar {
    background-color: #f8f9fa;
    font-size: 0.95rem;
}

.badge {
    font-size: 0.8rem;
    padding: 0.4em 0.8em;
}

.archivo-display {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 5px;
}

.archivo-display-retro {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid #eee;
}

.archivo-display-retro:last-child {
    border-bottom: none;
}

.card-body-scrollable {
    max-height: 200px;
    overflow-y: auto;
}
</style>