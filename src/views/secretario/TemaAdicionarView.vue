<script setup>
import { ref, computed } from 'vue'
import { usuarios } from '@/data/usuarios.js'

// Nombre del tema
const nombre = ref('')

// Estudiante
const textoEstudiante = ref('')
const estudianteSeleccionado = ref(null)
const mostrarOpciones = ref(false)

// Lista de estudiantes
const estudiantes = computed(() =>
    usuarios.filter(u => u.rol === 'estudiante')
)

const estudiantesFiltrados = computed(() => {
    const criterio = textoEstudiante.value.trim().toLowerCase()
    return estudiantes.value.filter(e =>
        `${e.nombres} ${e.primer_apellido} ${e.segundo_apellido}`
            .toLowerCase()
            .includes(criterio)
    )
})

function seleccionarEstudiante(estudiante) {
    estudianteSeleccionado.value = estudiante
    textoEstudiante.value = `${estudiante.primer_apellido} ${estudiante.segundo_apellido}, ${estudiante.nombres}`
    mostrarOpciones.value = false
}

function ocultarOpcionesConDelay() {
    setTimeout(() => {
        mostrarOpciones.value = false
    }, 200)
}

// Archivo
const archivo = ref(null)

function handleFileUpload(event) {
    const file = event.target.files[0]
    if (file) {
        archivo.value = file
    }
}

function eliminarArchivo() {
    archivo.value = null
}

// Estado fijo
const estado = ref('preliminar')

function claseEstado() {
    switch (estado.value) {
        case 'aprobado': return 'badge bg-success'
        case 'reprobado': return 'badge bg-danger'
        case 'pendiente': return 'badge bg-warning text-dark'
        case 'preliminar': return 'badge bg-secondary'
        default: return 'badge bg-light'
    }
}

function obtenerIconoArchivo(nombre) {
    const extension = nombre.split('.').pop().toLowerCase()
    if (['pdf'].includes(extension)) return '📄'
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) return '🖼️'
    return '📁'
}

</script>

<template>
    <section class="container mt-4 d-flex flex-column align-items-center">
        <div class="card shadow w-100" style="max-width: 600px;">
            <div class="card-header bg-primary text-white fw-bold">
                Registrar nuevo tema
            </div>

            <div class="card-body">
                <!-- Nombre del tema -->
                <div class="mb-3">
                    <label class="form-label text-start w-100">Nombre del tema</label>
                    <input type="text" v-model="nombre" class="form-control" />
                </div>

                <!-- Estudiante -->
                <div class="mb-3 position-relative">
                    <label class="form-label text-start w-100">Seleccione estudiante</label>
                    <input type="text" class="form-control" v-model="textoEstudiante"
                        placeholder="Escriba para buscar..." @focus="mostrarOpciones = true"
                        @blur="ocultarOpcionesConDelay" />
                    <ul v-if="mostrarOpciones && estudiantesFiltrados.length" class="list-group position-absolute w-100"
                        style="z-index: 10; max-height: 200px; overflow-y: auto;">
                        <li v-for="e in estudiantesFiltrados" :key="e.idUsuario"
                            class="list-group-item list-group-item-action" style="cursor: pointer"
                            @mousedown.prevent="seleccionarEstudiante(e)">
                            {{ e.primer_apellido }} {{ e.segundo_apellido }}, {{ e.nombres }}
                        </li>
                    </ul>
                </div>

                <!-- Archivo -->
                <div class="mb-3">
                    <label class="form-label text-start w-100">Archivo del tema</label>

                    <!-- Zona de carga personalizada -->
                    <div class="border rounded p-4 text-center bg-light mb-2" style="cursor: pointer"
                        @click="$refs.inputArchivo.click()" @dragover.prevent @drop.prevent="handleFileUpload($event)">
                        <!-- Si no hay archivo -->
                        <p v-if="!archivo" class="text-muted mb-0">
                            Arrastra o haz clic aquí para cargar archivo
                        </p>

                        <!-- Si hay archivo cargado -->
                        <div v-else class="d-flex justify-content-between align-items-center px-3">
                            <div class="d-flex align-items-center gap-2">
                                <span style="font-size: 1.5rem">{{ obtenerIconoArchivo(archivo.name) }}</span>
                                <span class="text-success text-start">{{ archivo.name }}</span>
                            </div>
                            <button class="btn btn-sm btn-outline-danger" @click.stop="eliminarArchivo">Quitar</button>
                        </div>
                    </div>

                    <!-- Input oculto tradicional -->
                    <input ref="inputArchivo" type="file" class="d-none" @change="handleFileUpload" />
                </div>

                <!-- Estado (no editable) -->
                <div class="mb-3 d-flex justify-content-between align-items-center">
                    <label class="form-label fw-semibold mb-0">Estado del tema</label>
                    <span :class="claseEstado()" class="px-3 py-1">
                        {{ estado.toUpperCase() }}
                    </span>
                </div>

                <!-- Botón Guardar -->
                <div class="text-center mt-4">
                    <button class="btn btn-success px-4">Registrar tema</button>
                </div>
            </div>
        </div>
    </section>
</template>
