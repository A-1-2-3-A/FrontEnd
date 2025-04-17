<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'

const route = useRoute()
const temaId = parseInt(route.params.id)

const tema = ref(null)
const estudiante = ref(null)
const archivoTema = ref(null)

const archivosRetro = ref([])
const nuevoComentario = ref('')
const observaciones = ref('')
const veredictoSeleccionado = ref('')
const veredictos = [
    { label: 'Aprobado', value: 'aprobado', clase: 'bg-success text-white' },
    { label: 'Reprobado', value: 'reprobado', clase: 'bg-danger text-white' },
    { label: 'Aprobado con Observaciones', value: 'aprobado con observaciones', clase: 'bg-warning text-dark' }
]

function claseVeredicto(valor) {
    const encontrado = veredictos.find(v => v.value === valor)
    return encontrado?.clase || ''
}

function handleArchivoRetro(e) {
    const files = Array.from(e.target.files)
    if (archivosRetro.value.length + files.length <= 3) {
        archivosRetro.value.push(...files)
    }
}

function eliminarArchivoRetro(i) {
    archivosRetro.value.splice(i, 1)
}

function cancelarComentario() {
    nuevoComentario.value = ''
}

function enviarComentario() {
    // Simular acción de envío
    alert(`Comentario enviado: ${nuevoComentario.value}`)
    nuevoComentario.value = ''
}

function publicarVeredicto() {
    alert('Información publicada: veredicto, retroalimentación y observaciones.')
}

onMounted(() => {
    tema.value = temas.find(t => t.idTema === temaId)
    archivoTema.value = tema.value?.archivo || null

    if (tema.value) {
        estudiante.value = usuarios.find(u => u.idUsuario === tema.value.idEstudiante)
    }
})
</script>

<template>
    <section class="container mt-4">
        <h2 class="fw-bold text-center mb-4">Gestión del tema</h2>

        <div class="row mb-4">
            <!-- Información -->
            <div class="col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-header fw-bold text-primary">Información</div>
                    <div class="card-body">
                        <p><strong>Nombre del tema:</strong><br />{{ tema?.nombre || 'Sin información' }}</p>
                        <p><strong>Estudiante responsable:</strong><br />
                            {{ estudiante ? `${estudiante.primer_apellido} ${estudiante.segundo_apellido},
                            ${estudiante.nombres}` : 'No asignado' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Retroalimentación Archivos -->
            <div class="col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-header fw-bold text-primary">Archivos de retroalimentación</div>
                    <div class="card-body">
                        <div class="mb-2">
                            <input type="file" class="form-control" multiple @change="handleArchivoRetro" />
                        </div>
                        <ul class="list-group small">
                            <li class="list-group-item d-flex justify-content-between align-items-center"
                                v-for="(archivo, i) in archivosRetro" :key="i">
                                {{ archivo.name }}
                                <button class="btn btn-sm btn-outline-danger"
                                    @click="eliminarArchivoRetro(i)">Eliminar</button>
                            </li>
                            <li v-if="archivosRetro.length === 0" class="text-muted list-group-item text-center">No hay
                                archivos</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-4">
            <!-- Archivo del tema -->
            <div class="col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-header fw-bold text-primary">Archivo</div>
                    <div class="card-body">
                        <p class="text-muted">Archivo original del estudiante:</p>
                        <div v-if="archivoTema"
                            class="border rounded bg-light p-2 d-flex align-items-center justify-content-between">
                            <div>
                                <i class="bi bi-file-earmark-text me-2"></i>
                                <a :href="'/archivos/' + archivoTema" download
                                    class="text-decoration-none text-success">
                                    {{ archivoTema }}
                                </a>
                            </div>
                            <a :href="'/archivos/' + archivoTema" download class="btn btn-sm btn-outline-primary">
                                Descargar
                            </a>
                        </div>
                        <div v-else class="text-muted">No hay archivo disponible.</div>
                    </div>
                </div>
            </div>


            <!-- Comentarios -->
            <div class="col-md-6">
                <div class="card h-100 shadow-sm">
                    <div class="card-header fw-bold text-primary">Comentarios</div>
                    <div class="card-body">
                        <textarea class="form-control mb-2" rows="4" placeholder="Escriba su comentario..."
                            v-model="nuevoComentario"></textarea>
                        <div v-if="nuevoComentario" class="text-end">
                            <button class="btn btn-sm btn-secondary me-2" @click="cancelarComentario">Cancelar</button>
                            <button class="btn btn-sm btn-primary" @click="enviarComentario">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Observaciones y Veredicto -->
        <div class="card shadow">
            <div class="card-body row g-3 px-4 py-4">
                <!-- Observaciones -->
                <div class="col-md-8">
                    <label class="form-label fw-bold">Observaciones</label>
                    <textarea class="form-control" rows="3" v-model="observaciones"
                        placeholder="Escriba sus observaciones..."></textarea>
                </div>

                <!-- Veredicto -->
                <div class="col-md-4">
                    <label class="form-label fw-bold">Veredicto</label>
                    <select v-model="veredictoSeleccionado" class="form-select">
                        <option disabled value="">Seleccione veredicto</option>
                        <option v-for="v in veredictos" :key="v.value" :value="v.value">
                            {{ v.label }}
                        </option>
                    </select>
                    <div v-if="veredictoSeleccionado" class="mt-2 text-center">
                        <span class="badge px-3 py-2" :class="claseVeredicto(veredictoSeleccionado)">
                            {{ veredictoSeleccionado.toUpperCase() }}
                        </span>
                    </div>
                </div>

                <!-- Botón Publicar -->
                <div class="col-12 text-center mt-3">
                    <button class="btn btn-success px-5" @click="publicarVeredicto" :disabled="!veredictoSeleccionado">
                        Publicar
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>
