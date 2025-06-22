<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'

const route = useRoute()
const temaId = parseInt(route.params.id)

// --- ESTADO DEL COMPONENTE ---
const tema = ref(null)
const estudiante = ref(null)
const historialRevisiones = ref([])
const revisionSeleccionada = ref(1)
const nuevoComentario = ref('')
const archivosParaSubir = ref([])
const nuevoVeredicto = ref('')
const nuevasObservaciones = ref('')

// --- LÓGICA AL MONTAR EL COMPONENTE ---
onMounted(() => {
    tema.value = temas.find(t => t.idTema === temaId)
    if (tema.value) {
        estudiante.value = usuarios.find(u => u.idUsuario === tema.value.idEstudiante)
    }

    // Simulación de datos actualizada para incluir comentarios del estudiante
    historialRevisiones.value = [
        {
            version: 1,
            documentoEstudiante: { 
                nombre: 'tema_v1_final.pdf', 
                ruta: '...',
                comentarios: null // No hubo comentarios en el primer envío
            },
            veredictoEmitido: {
                veredicto: 'REVISADO',
                observaciones: 'Falta profundidad en el marco teórico.',
                comentarios: [{ fecha: '2025-06-19 08:30', texto: 'Iniciando revisión del documento.' }],
                archivos: [{ nombre: 'correcciones_seccion2.pdf', ruta: '...' }]
            }
        },
        {
            version: 2,
            documentoEstudiante: { 
                nombre: 'tema_v2_corregido.pdf', 
                ruta: '...',
                comentarios: 'Se ha corregido el marco teórico según las observaciones y se han añadido las referencias solicitadas en la bibliografía.' // Comentario enviado con la v2
            },
            veredictoEmitido: null // Aún no se revisa esta versión
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

const puedeRevisar = computed(() => {
    return revisionActual.value.version === historialRevisiones.value.length && !revisionActual.value.veredictoEmitido;
});

// --- LÓGICA DE ACCIONES ---
const listaComentarios = ref([{ fecha: '2025-06-19 08:30', texto: 'Iniciando revisión del documento.' }]);
const listaArchivosRetro = ref([]);

function enviarComentario() {
    if (!nuevoComentario.value.trim()) return;
    listaComentarios.value.push({
        fecha: new Date().toLocaleString('es-ES'),
        texto: nuevoComentario.value
    });
    nuevoComentario.value = '';
}

function handleFileUpload(event) {
    archivosParaSubir.value.push(...event.target.files);
}

function subirArchivos() {
    if (archivosParaSubir.value.length === 0) return;
    listaArchivosRetro.value.push(...archivosParaSubir.value.map(f => ({ nombre: f.name })));
    alert(`${archivosParaSubir.value.length} archivo(s) subido(s) con éxito.`);
    archivosParaSubir.value = [];
}

function publicarRevision() {
    if (!nuevoVeredicto.value) {
        alert('Debe seleccionar un veredicto antes de publicar.');
        return;
    }
    alert(`Publicando revisión final:\n- Veredicto: ${nuevoVeredicto.value}\n- Observaciones: ${nuevasObservaciones.value}`);
}
</script>

<template>
    <section class="container mt-4">
        <div v-if="tema && estudiante">
            <h2 class="fw-bold text-center mb-4">Gestión de Revisión de Tema</h2>

            <!-- BARRA DE NAVEGACIÓN DE REVISIÓN -->
            <div class="revision-bar card card-body mb-4">
                 <div class="row w-100 align-items-center text-center">
                    <div class="col-md-7">
                        <span class="fw-semibold">Estudiante:</span> {{ estudiante.nombres }} {{ estudiante.primer_apellido }}
                    </div>
                    <div class="col-md-5 d-flex justify-content-center align-items-center">
                        <label for="revisionSelect" class="form-label mb-0 me-2 fw-semibold">Ver Versión:</label>
                        <select id="revisionSelect" class="form-select form-select-sm w-auto" v-model="revisionSeleccionada">
                            <option v-for="r in historialRevisiones" :key="r.version" :value="r.version">Versión #{{ r.version }}</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- CUADRÍCULAS DE TRABAJO -->
            <div class="row g-4">
                <!-- COLUMNA IZQUIERDA: Material de Referencia y Comunicación -->
                <div class="col-lg-6 d-flex flex-column gap-4">
                    <!-- Documento a Revisar -->
                     <div class="card shadow-sm">
                        <div class="card-header fw-bold bg-primary text-white">Documento a Revisar</div>
                        <div class="card-body">
                            <div class="archivo-display">
                                <i class="bi bi-file-earmark-pdf-fill"></i>
                                <span>{{ revisionActual.documentoEstudiante?.nombre }}</span>
                                <a href="#" class="btn btn-sm btn-outline-secondary ms-auto">Descargar</a>
                            </div>

                            <!-- **NUEVA SECCIÓN AQUÍ** -->
                            <div v-if="revisionActual.documentoEstudiante?.comentarios" class="mt-3 border-top pt-3">
                                 <label class="form-label fw-semibold">Comentarios del Estudiante en este Envío:</label>
                                 <p class="text-muted fst-italic">"{{ revisionActual.documentoEstudiante.comentarios }}"</p>
                            </div>
                        </div>
                    </div>
                    <!-- Comentarios -->
                    <div class="card shadow-sm">
                        <div class="card-header fw-bold">Comentarios</div>
                        <div class="card-body">
                           <div class="historial-comentarios mb-3">
                               <p v-if="listaComentarios.length === 0" class="text-muted text-center">No hay comentarios.</p>
                               <div v-for="c in listaComentarios" :key="c.fecha" class="comentario">
                                   <small class="text-muted">{{ c.fecha }}</small>
                                   <p>{{ c.texto }}</p>
                               </div>
                           </div>
                           <div class="input-group">
                                <input type="text" v-model="nuevoComentario" class="form-control" placeholder="Escribir un comentario..." @keyup.enter="enviarComentario" :disabled="!puedeRevisar">
                                <button class="btn btn-outline-primary" @click="enviarComentario" :disabled="!puedeRevisar">Enviar</button>
                           </div>
                        </div>
                    </div>
                    <!-- Archivos de Retroalimentación -->
                    <div class="card shadow-sm">
                        <div class="card-header fw-bold">Archivos de Retroalimentación</div>
                        <div class="card-body">
                            <div class="input-group mb-3">
                               <input type="file" class="form-control" multiple @change="handleFileUpload" :disabled="!puedeRevisar">
                               <button class="btn btn-outline-primary" @click="subirArchivos" :disabled="archivosParaSubir.length === 0">Subir Archivos</button>
                            </div>
                            <p v-if="listaArchivosRetro.length === 0" class="text-muted">No se han subido archivos.</p>
                            <ul v-else class="list-group">
                                <li v-for="file in listaArchivosRetro" :key="file.nombre" class="list-group-item">{{file.nombre}}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- COLUMNA DERECHA: Evaluación Final -->
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
                                    <textarea class="form-control" rows="10" v-model="nuevasObservaciones" placeholder="Escriba aquí las observaciones generales..."></textarea>
                                </div>
                            </div>
                            <div v-else class="text-center text-muted p-4 d-flex align-items-center justify-content-center h-100">
                                <p>Ya se ha emitido un veredicto para esta versión.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botón de Publicación Final -->
                <div class="col-12 text-center mt-3">
                    <button class="btn btn-success px-5" @click="publicarRevision" :disabled="!puedeRevisar">Publicar Revisión</button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.revision-bar { background-color: #f8f9fa; font-size: 0.95rem; }
.archivo-display { display: flex; align-items: center; gap: 10px; padding: 10px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 5px; }
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
.comentario:last-child { border-bottom: none; margin-bottom: 0; }
</style>