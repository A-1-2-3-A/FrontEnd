<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usuarios } from '@/data/usuarios.js'
import { temas } from '@/data/temas.js'

const route = useRoute()
const tribunalId = parseInt(route.params.id)
const temaId = parseInt(route.params.temaId)

// --- ESTADO DEL COMPONENTE ---
const tribunal = ref(null)
const tema = ref(null)
const historialRevisiones = ref([])
const revisionSeleccionada = ref(1)

// Estados para la nueva corrección del estudiante
const archivoCorreccion = ref(null)
const comentariosEstudiante = ref('') // Nuevo campo para los comentarios del estudiante

// --- LÓGICA AL MONTAR EL COMPONENTE ---
onMounted(() => {
    tribunal.value = usuarios.find(u => u.idUsuario === tribunalId)
    tema.value = temas.find(t => t.idTema === temaId)

    historialRevisiones.value = [
        {
            version: 1,
            documentoEstudiante: { 
                nombre: 'tema_v1_final.pdf', 
                ruta: 'uploads/temas/tema_v1.pdf',
                comentarios: null // No hubo comentarios en la primera entrega
            },
            veredicto: 'REVISADO',
            observaciones: 'Falta profundidad en el marco teórico. La bibliografía es escasa y desactualizada.',
            comentariosTribunal: [{ fecha: '2025-06-19', texto: 'El marco teórico necesita más trabajo.' }],
            archivosRetroalimentacion: [{ nombre: 'correcciones_seccion2.pdf', ruta: 'uploads/retro/retro_v1.pdf' }]
        },
        {
            version: 2,
            documentoEstudiante: { 
                nombre: 'tema_v2_corregido.pdf', 
                ruta: 'uploads/temas/tema_v2.pdf',
                comentarios: 'Se ha ampliado el marco teórico y se añadieron las referencias solicitadas.' // Comentario enviado con la v2
            },
            veredicto: 'APROBADO',
            observaciones: 'Las correcciones han sido aplicadas satisfactoriamente. Buen trabajo.',
            comentariosTribunal: [{ fecha: '2025-06-21', texto: 'Revisión final completada.' }],
            archivosRetroalimentacion: []
        }
    ];
    if (historialRevisiones.value.length > 0) {
        revisionSeleccionada.value = historialRevisiones.value.length;
    }
});

// --- PROPIEDADES COMPUTADAS ---
const revisionActual = computed(() => {
    return historialRevisiones.value.find(r => r.version === revisionSeleccionada.value) || {};
});

const veredictoFinal = computed(() => {
    if (historialRevisiones.value.length === 0) return 'PENDIENTE';
    return historialRevisiones.value[historialRevisiones.value.length - 1].veredicto;
});

const requiereAccion = computed(() => veredictoFinal.value === 'REVISADO');

// --- FUNCIONES AUXILIARES ---
const getVeredictoClass = (veredicto) => {
    switch (veredicto) {
        case 'APROBADO': return 'badge bg-success';
        case 'REPROBADO': return 'badge bg-danger';
        case 'REVISADO': return 'badge bg-warning text-dark';
        default: return 'badge bg-secondary';
    }
};

function handleFileUpload(event) {
    archivoCorreccion.value = event.target.files[0];
}

function enviarCorreccion() {
    if (!archivoCorreccion.value) {
        alert("Por favor, seleccione un archivo para enviar.");
        return;
    }
    alert(`Enviando corrección:\n- Archivo: ${archivoCorreccion.value.name}\n- Comentarios: ${comentariosEstudiante.value || 'Sin comentarios.'}`);
}
</script>

<template>
    <section class="container mt-4">
        <div v-if="tribunal && tema">
            <h2 class="fw-bold text-center mb-4">Detalle de Revisión</h2>

            <!-- BARRA DE NAVEGACIÓN DE REVISIÓN -->
            <div class="revision-bar card card-body mb-4">
                 <div class="row w-100 align-items-center text-center">
                    <div class="col-md-5">
                        <span class="fw-semibold">Tribunal:</span> {{ tribunal.nombres }} {{ tribunal.primer_apellido }}
                    </div>
                    <div class="col-md-3">
                        <span class="fw-semibold">Veredicto:</span> <span :class="getVeredictoClass(revisionActual.veredicto)">{{ revisionActual.veredicto }}</span>
                    </div>
                    <div class="col-md-4 d-flex justify-content-center align-items-center">
                        <label for="revisionSelect" class="form-label mb-0 me-2 fw-semibold">Ver Intento:</label>
                        <select id="revisionSelect" class="form-select form-select-sm w-auto" v-model="revisionSeleccionada">
                            <option v-for="r in historialRevisiones" :key="r.version" :value="r.version">
                                Revisión #{{ r.version }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- CUADRÍCULAS DE INFORMACIÓN -->
            <div class="row g-4">
                <!-- 1. Documento del Estudiante y Acción -->
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold bg-primary text-white">Documento de la Revisión</div>
                        <div class="card-body">
                            <label class="form-label fw-semibold">Documento enviado:</label>
                            <div class="archivo-display">
                                <i class="bi bi-file-earmark-pdf-fill"></i>
                                <span>{{ revisionActual.documentoEstudiante?.nombre }}</span>
                                <a href="#" class="btn btn-sm btn-outline-secondary ms-auto">Descargar</a>
                            </div>
                            
                            <!-- **MODIFICACIÓN AQUÍ** -->
                            <div v-if="revisionActual.documentoEstudiante?.comentarios" class="mt-3 border-top pt-3">
                                 <label class="form-label fw-semibold">Comentarios del Envío:</label>
                                 <p class="text-muted fst-italic">"{{ revisionActual.documentoEstudiante.comentarios }}"</p>
                            </div>
                            
                            <!-- Panel de acción para subir nueva corrección -->
                            <div v-if="requiereAccion && revisionSeleccionada === historialRevisiones.length" class="mt-4 border-top pt-3">
                                <h6 class="text-success fw-bold">Acción Requerida</h6>
                                <p class="small text-muted mb-2">Sube una nueva versión corregida y añade tus comentarios.</p>
                                <div class="mb-3">
                                    <label class="form-label">Archivo Corregido (PDF):</label>
                                    <input type="file" class="form-control" @change="handleFileUpload" id="fileUpload" accept=".pdf">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Comentarios para el Tribunal (Opcional):</label>
                                    <textarea class="form-control" rows="3" v-model="comentariosEstudiante" placeholder="Ej: He aplicado las correcciones solicitadas..."></textarea>
                                </div>
                                <button class="btn btn-success w-100 mt-2" @click="enviarCorreccion" :disabled="!archivoCorreccion">Enviar Corrección</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. Observaciones del Tribunal -->
                <div class="col-md-6">
                     <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold bg-secondary text-white">Observaciones</div>
                        <div class="card-body card-body-scrollable">
                            <p v-if="!revisionActual.observaciones" class="text-muted text-center pt-3">No hay observaciones.</p>
                            <p v-else style="white-space: pre-wrap;">{{ revisionActual.observaciones }}</p>
                        </div>
                    </div>
                </div>

                <!-- 3. Comentarios del Tribunal -->
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold">Comentarios del Tribunal</div>
                        <div class="card-body card-body-scrollable">
                            <p v-if="!revisionActual.comentariosTribunal?.length" class="text-muted text-center pt-3">No hay comentarios.</p>
                            <ul v-else class="list-unstyled">
                                <li v-for="comment in revisionActual.comentariosTribunal" :key="comment.fecha" class="mb-2 border-bottom pb-2">
                                    <small class="text-muted d-block">{{ comment.fecha }}</small>
                                    <p class="mb-0">{{ comment.texto }}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 4. Archivos de Retroalimentación -->
                <div class="col-md-6">
                    <div class="card shadow-sm h-100">
                        <div class="card-header fw-bold">Archivos de Retroalimentación</div>
                         <div class="card-body">
                            <p v-if="!revisionActual.archivosRetroalimentacion?.length" class="text-muted text-center pt-3">No hay archivos.</p>
                            <ul v-else class="list-unstyled mb-0">
                                <li v-for="file in revisionActual.archivosRetroalimentacion" :key="file.nombre" class="archivo-display-retro">
                                    <i class="bi bi-file-earmark-arrow-down"></i>
                                    <span>{{ file.nombre }}</span>
                                    <a href="#" class="btn btn-sm btn-outline-secondary ms-auto">Descargar</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.revision-bar { background-color: #f8f9fa; font-size: 0.95rem; }
.badge { font-size: 0.8rem; padding: 0.4em 0.8em; }
.archivo-display { display: flex; align-items: center; gap: 10px; padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; }
.archivo-display-retro { display: flex; align-items: center; gap: 10px; padding: 8px; border-bottom: 1px solid #eee; }
.archivo-display-retro:last-child { border-bottom: none; }
.card-body-scrollable { max-height: 200px; overflow-y: auto; }
</style>