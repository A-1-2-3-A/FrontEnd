<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { temas } from '@/data/temas.js';
import { usuarios } from '@/data/usuarios.js';
import { historialRevisiones } from '@/data/historialRevisiones.js';
import { useAuthStore } from '@/stores/auth'; 
import axios from 'axios';

const route = useRoute();
const temaId = parseInt(route.params.id);
const authStore = useAuthStore();

// --- ESTADO DEL COMPONENTE ---
const tema = ref(null);
const estudiante = ref(null);
const revisionesTribunales = ref([]);
const estadoGeneralTema = ref('Calculando...');
const historialVisiblePara = ref(null);

// --- LÓGICA AL MONTAR EL COMPONENTE ---
onMounted(() => {
    tema.value = temas.find(t => t.idTema === temaId);
    if (!tema.value) return;

    estudiante.value = usuarios.find(u => u.idUsuario === tema.value.idEstudiante);

    const historialesDelTema = historialRevisiones.filter(h => h.idTema === temaId);

    revisionesTribunales.value = historialesDelTema.map(historial => {
        const tribunalInfo = usuarios.find(u => u.idUsuario === historial.idTribunal);
        const ultimaRevision = historial.revisiones[historial.revisiones.length - 1];
        return {
            idTribunal: tribunalInfo.idUsuario,
            nombreCompleto: `${tribunalInfo.nombres} ${tribunalInfo.primer_apellido}`,
            veredictoActual: ultimaRevision.veredicto,
            fechaUltimoVeredicto: ultimaRevision.fecha_veredicto,
            historialCompleto: historial.revisiones
        };
    });

    const veredictosActuales = revisionesTribunales.value.map(t => t.veredictoActual);
    if (veredictosActuales.includes('REPROBADO')) {
        estadoGeneralTema.value = 'REPROBADO';
    } else if (veredictosActuales.includes('REVISADO')) {
        estadoGeneralTema.value = 'REVISADO';
    } else if (veredictosActuales.every(v => v === 'APROBADO')) {
        estadoGeneralTema.value = 'APROBADO';
    } else {
        estadoGeneralTema.value = 'PENDIENTE';
    }
});

// --- FUNCIONES ---
function toggleHistorial(idTribunal) {
    historialVisiblePara.value = historialVisiblePara.value === idTribunal ? null : idTribunal;
}

async function descargarArchivo(ruta, nombreArchivo) {
    try {
        const response = await axios.get(`http://localhost:3000/archivos/descargar?ruta=${ruta}`, {
            headers: { 'Authorization': `Bearer ${authStore.token}` },
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', nombreArchivo);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error al descargar el archivo:', error);
        alert('No se pudo descargar el archivo.');
    }
}


const getVeredictoClass = (veredicto) => {
    switch (veredicto) {
        case 'APROBADO': return 'bg-success';
        case 'REPROBADO': return 'bg-danger';
        case 'REVISADO': return 'bg-warning text-dark';
        default: return 'bg-secondary';
    }
};

const formatearFecha = (fecha) => {
    if (!fecha) return '---';
    return new Date(fecha).toLocaleDateString('es-ES');
};
</script>

<template>
    <section class="container mt-4">
        <div v-if="tema">
            <h2 class="fw-bold text-center mb-4">Detalle y Seguimiento del Tema</h2>

            <!-- Panel de Información General -->
            <div class="card shadow-sm mb-4">
                 <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            <h5 class="card-title fw-bold">{{ tema.nombre }}</h5>
                            <p class="card-text text-muted mb-0">Estudiante: {{ estudiante?.nombres }} {{ estudiante?.primer_apellido }}</p>
                        </div>
                        <div class="col-md-4 text-md-end mt-3 mt-md-0">
                            <h6 class="text-muted mb-1">Estado General del Tema</h6>
                            <span class="badge fs-6 px-3 py-2" :class="getVeredictoClass(estadoGeneralTema)">{{ estadoGeneralTema }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Panel de Monitoreo de Revisiones -->
            <div class="card shadow-sm">
                <div class="card-header fw-bold bg-dark text-white">Monitoreo de Revisiones por Tribunal</div>
                <div class="table-responsive">
                    <table class="table table-striped table-hover mb-0">
                        <thead class="text-center">
                            <tr>
                                <th>Tribunal</th>
                                <th>Último Veredicto</th>
                                <th>Fecha</th>
                                <th>Trazabilidad</th>
                            </tr>
                        </thead>
                        <tbody class="text-center align-middle">
                            <template v-for="revision in revisionesTribunales" :key="revision.idTribunal">
                                <tr>
                                    <td>{{ revision.nombreCompleto }}</td>
                                    <td><span class="badge" :class="getVeredictoClass(revision.veredictoActual)">{{ revision.veredictoActual }}</span></td>
                                    <td>{{ formatearFecha(revision.fechaUltimoVeredicto) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-outline-info" @click="toggleHistorial(revision.idTribunal)">
                                            <i class="bi bi-clock-history"></i> Ver Historial
                                        </button>
                                    </td>
                                </tr>
                                <!-- FILA DE HISTORIAL DESPLEGABLE CON ARCHIVO MEJORADO -->
                                <tr v-if="historialVisiblePara === revision.idTribunal">
                                    <td colspan="4" class="p-3 bg-light">
                                        <h6 class="fw-bold">Historial de Revisiones para {{ revision.nombreCompleto }}:</h6>
                                        <ul class="list-group">
                                            <li v-for="h in revision.historialCompleto" :key="h.version" class="list-group-item">
                                                <div class="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>Versión #{{ h.version }}:</strong> Veredicto de "{{ h.veredicto }}"
                                                        <br>
                                                        <!-- **MODIFICACIÓN AQUÍ** -->
                                                        <small class="text-muted">
                                                            Archivo Revisado: 
                                                            <a href="#" @click.prevent="descargarArchivo(h.documentoRevisado.ruta, h.documentoRevisado.nombre)" class="file-download-link">
                                                                {{ h.documentoRevisado.nombre }}
                                                            </a>
                                                        </small>
                                                    </div>
                                                    <span class="text-muted">{{ formatearFecha(h.fecha_veredicto) }}</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Estilo para el enlace de descarga personalizado */
.file-download-link {
    color: inherit; /* Hereda el color de .text-muted */
    text-decoration: none; /* Sin subrayado por defecto */
    cursor: pointer;
    font-weight: 500; /* Ligeramente más grueso para destacar */
    transition: color 0.2s;
}

.file-download-link:hover {
    color: #0d6efd; /* Cambia a color primario al pasar el mouse */
    text-decoration: underline; /* Subrayado solo en hover */
}
</style>