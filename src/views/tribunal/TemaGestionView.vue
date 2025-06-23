<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useModalStore } from '@/stores/modal';
import apiClient from '@/api/axios.js';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const modalStore = useModalStore();
const temaId = parseInt(route.params.id);

const tema = ref(null);
const isLoading = ref(true);

// Estado para la UI interactiva
const revisionSeleccionadaId = ref(null); // ID de la VersionesTema seleccionada
const listaComentarios = ref([]);
const listaArchivosRetro = ref([]);

// Estado para los formularios
const nuevoComentario = ref('');
const archivosParaSubir = ref(null); // Usamos ref(null) para el input tipo file
const nuevoVeredicto = ref('');
const nuevasObservaciones = ref('');

// Encuentra la información de la asignación específica de este tribunal para este tema.
const miAsignacion = computed(() => {
    if (!tema.value) return null;
    const idTribunalLogueado = authStore.usuario?.id;
    return tema.value.revisionesPorTribunal.find(r => r.idTribunal === idTribunalLogueado);
});

// Devuelve el objeto completo de la revisión (versión) que está seleccionada en el dropdown.
const revisionVisualizada = computed(() => {
    if (!miAsignacion.value || !revisionSeleccionadaId.value) return null;
    return miAsignacion.value.historialCompleto.find(h => h.id === revisionSeleccionadaId.value);
});

// Determina si el tribunal puede emitir un veredicto para la versión más reciente.
const puedeRevisar = computed(() => {
    if (!miAsignacion.value) return false;
    const ultimaRevision = miAsignacion.value.historialCompleto[miAsignacion.value.historialCompleto.length - 1];
    // Solo se puede revisar la última versión y si su veredicto está PENDIENTE.
    return ultimaRevision && ultimaRevision.veredicto === 'PENDIENTE';
});

// Carga los datos principales del tema.
async function fetchTemaDetalle() {
    isLoading.value = true;
    try {
        const response = await apiClient.get(`/temas/${temaId}`);
        tema.value = response.data.data;

        // Al cargar, seleccionamos automáticamente la última versión para visualizar.
        if (miAsignacion.value && miAsignacion.value.historialCompleto.length > 0) {
            const ultimaRevision = miAsignacion.value.historialCompleto[miAsignacion.value.historialCompleto.length - 1];
            revisionSeleccionadaId.value = ultimaRevision.id;
        }
    } catch (error) {
        console.error("Error al obtener el detalle del tema:", error);
    } finally {
        isLoading.value = false;
    }
}

// Carga los comentarios y archivos de retroalimentación para una versión específica.
async function fetchRetroalimentacion(idVersionTema) {
    if (!idVersionTema || !miAsignacion.value) return;
    try {
        const response = await apiClient.get(`/retroalimentaciones/${miAsignacion.value.idAsignacion}?id_version_tema=${idVersionTema}`);
        listaComentarios.value = response.data.data.comentarios;
        listaArchivosRetro.value = response.data.data.archivos;
    } catch (error) {
        console.error("Error al obtener la retroalimentación:", error);
    }
}

// Envía un nuevo comentario a la API.
async function enviarComentario() {
    if (!nuevoComentario.value.trim() || !revisionVisualizada.value) return;
    try {
        await apiClient.post(`/retroalimentaciones/comentario/${miAsignacion.value.idAsignacion}`, {
            id_version_tema: revisionVisualizada.value.id,
            texto_comentario: nuevoComentario.value
        });
        nuevoComentario.value = '';
        // Recargamos la retroalimentación para mostrar el nuevo comentario.
        fetchRetroalimentacion(revisionVisualizada.value.id);
    } catch (error) {
        modalStore.showModal({ title: 'Error', message: 'No se pudo enviar el comentario.', type: 'error' });
    }
}

// Sube un archivo de retroalimentación a la API.
function handleFileUpload(event) {
    archivosParaSubir.value = event.target.files[0];
}
async function subirArchivo() {
    if (!archivosParaSubir.value || !revisionVisualizada.value) return;

    const formData = new FormData();
    formData.append('id_version_tema', revisionVisualizada.value.id);
    formData.append('archivo_retroalimentacion', archivosParaSubir.value);

    try {
        await apiClient.post(`/retroalimentaciones/archivo/${miAsignacion.value.idAsignacion}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        archivosParaSubir.value = null; // Limpiar input
        document.getElementById('fileInput').value = ''; // Limpiar el campo de archivo visualmente
        fetchRetroalimentacion(revisionVisualizada.value.id); // Recargar para ver el nuevo archivo
        modalStore.showModal({ title: 'Éxito', message: 'Archivo subido correctamente.', type: 'success' });
    } catch (error) {
        modalStore.showModal({ title: 'Error', message: 'No se pudo subir el archivo.', type: 'error' });
    }
}

// Publica el veredicto y las observaciones finales.
async function publicarRevision() {
    if (!nuevoVeredicto.value || !puedeRevisar.value) {
        modalStore.showModal({ title: 'Error', message: 'Debe seleccionar un veredicto.', type: 'error' });
        return;
    }
    const ultimaRevision = miAsignacion.value.historialCompleto[miAsignacion.value.historialCompleto.length - 1];

    try {
        await apiClient.put(`/revisiones/${ultimaRevision.id_revision}/veredicto`, {
            veredicto: nuevoVeredicto.value,
            observaciones: nuevasObservaciones.value
        });
        modalStore.showModal({ title: 'Éxito', message: 'Revisión publicada correctamente.', type: 'success' });
        // Redirigimos de vuelta a la lista de temas del tribunal.
        router.push({ name: 'TTemaView' });
    } catch (error) {
        modalStore.showModal({ title: 'Error', message: 'No se pudo publicar la revisión.', type: 'error' });
    }
}

onMounted(fetchTemaDetalle);

// Observa cambios en la versión seleccionada para cargar su retroalimentación.
watch(revisionSeleccionadaId, (newId) => {
    if (newId) {
        fetchRetroalimentacion(newId);
    }
});

</script>

<template>
    <section class="container mt-4">
        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando datos de la revisión...</p>
        </div>

        <div v-else-if="tema && miAsignacion">
            <h2 class="fw-bold text-center mb-4">Gestión de Revisión de Tema</h2>

            <div class="revision-bar card card-body mb-4">
                <div class="row w-100 align-items-center text-center">
                    <div class="col-md-7">
                        <span class="fw-semibold">Estudiante:</span> {{ tema.estudiante.nombreCompleto }}
                    </div>
                    <div class="col-md-5 d-flex justify-content-center align-items-center">
                        <label for="revisionSelect" class="form-label mb-0 me-2 fw-semibold">Ver Versión:</label>
                        <select id="revisionSelect" class="form-select form-select-sm w-auto"
                            v-model="revisionSeleccionadaId">
                            <option v-for="r in miAsignacion.historialCompleto" :key="r.id" :value="r.id">Versión #{{
                                r.version }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row g-4" v-if="revisionVisualizada">
                <div class="col-lg-6 d-flex flex-column gap-4">
                    <div class="card shadow-sm">
                        <div class="card-header fw-bold bg-primary text-white">Documento a Revisar</div>
                        <div class="card-body">
                            <div class="archivo-display">
                                <i class="bi bi-file-earmark-pdf-fill"></i>
                                <span>{{ revisionVisualizada.documentoEstudiante?.nombre }}</span>
                            </div>
                            <div v-if="revisionVisualizada.documentoEstudiante?.comentarios"
                                class="mt-3 border-top pt-3">
                                <label class="form-label fw-semibold">Comentarios del Estudiante:</label>
                                <p class="text-muted fst-italic">"{{ revisionVisualizada.documentoEstudiante.comentarios
                                    }}"</p>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow-sm">
                        <div class="card-header fw-bold">Comentarios</div>
                        <div class="card-body">
                            <div class="historial-comentarios mb-3">
                                <p v-if="listaComentarios.length === 0" class="text-muted text-center">No hay
                                    comentarios.</p>
                                <div v-for="c in listaComentarios" :key="c.id" class="comentario">
                                    <small class="text-muted">{{ new Date(c.fecha_publicacion).toLocaleString('es-ES')
                                        }}</small>
                                    <p>{{ c.texto_comentario }}</p>
                                </div>
                            </div>
                            <div class="input-group">
                                <input type="text" v-model="nuevoComentario" class="form-control"
                                    placeholder="Escribir comentario..." @keyup.enter="enviarComentario"
                                    :disabled="!puedeRevisar">
                                <button class="btn btn-outline-primary" @click="enviarComentario"
                                    :disabled="!puedeRevisar">Enviar</button>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow-sm">
                        <div class="card-header fw-bold">Archivos de Retroalimentación</div>
                        <div class="card-body">
                            <div class="input-group mb-3">
                                <input id="fileInput" type="file" class="form-control" @change="handleFileUpload"
                                    :disabled="!puedeRevisar">
                                <button class="btn btn-outline-primary" @click="subirArchivo"
                                    :disabled="!archivosParaSubir">Subir</button>
                            </div>
                            <p v-if="listaArchivosRetro.length === 0" class="text-muted">No se han subido archivos.</p>
                            <ul v-else class="list-group">
                                <li v-for="file in listaArchivosRetro" :key="file.id" class="list-group-item">
                                    {{ file.nombre }}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="card shadow-sm h-100" :class="!puedeRevisar ? 'bg-light' : ''">
                        <div class="card-header fw-bold bg-secondary text-white">Veredicto y Observaciones Finales</div>
                        <div class="card-body">
                            <div v-if="puedeRevisar">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Veredicto:</label>
                                    <select class="form-select" v-model="nuevoVeredicto">
                                        <option disabled value="">Seleccione un veredicto</option>
                                        <option value="APROBADO">Aprobado</option>
                                        <option value="REVISADO">Revisado (Aprobado con Obs.)</option>
                                        <option value="REPROBADO">Reprobado</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="form-label fw-semibold">Observaciones:</label>
                                    <textarea class="form-control" rows="10" v-model="nuevasObservaciones"
                                        placeholder="Escriba aquí las observaciones generales..."></textarea>
                                </div>
                            </div>
                            <div v-else
                                class="text-center text-muted p-4 d-flex align-items-center justify-content-center h-100">
                                <div>
                                    <p class="mb-1"><strong>Veredicto Emitido:</strong> {{ revisionVisualizada.veredicto
                                        }}</p>
                                    <p><strong>Fecha:</strong> {{ new
                                        Date(revisionVisualizada.fecha_veredicto).toLocaleDateString('es-ES') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 text-center mt-3">
                    <button class="btn btn-success px-5" @click="publicarRevision" :disabled="!puedeRevisar">Publicar
                        Revisión</button>
                </div>
            </div>
        </div>
        <div v-else-if="!isLoading" class="alert alert-danger text-center">
            No se pudo cargar la información de la revisión.
        </div>
    </section>
</template>

<style scoped>
.revision-bar {
    background-color: #f8f9fa;
    font-size: 0.95rem;
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

.historial-comentarios {
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #eee;
    padding: 1rem;
    border-radius: 5px;
}

.comentario {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
}

.comentario:last-child {
    border-bottom: none;
    margin-bottom: 0;
}
</style>