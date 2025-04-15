<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'
import { asignacionTribunal } from '@/data/asignacionTribunal.js'

const route = useRoute()
const temaId = parseInt(route.params.id)

const tema = ref(null)
const estudiante = ref(null)
const tribunalesAsignados = ref([])

const claseEstadoTema = (estado) => {
    switch (estado) {
        case 'aprobado': return 'badge bg-success'
        case 'reprobado': return 'badge bg-danger'
        case 'pendiente': return 'badge bg-warning text-dark'
        case 'preliminar': return 'badge bg-secondary'
        default: return 'badge bg-light text-dark'
    }
}

const claseVeredicto = (veredicto) => {
    switch (veredicto?.toLowerCase()) {
        case 'aprobado': return 'badge bg-success'
        case 'reprobado': return 'badge bg-danger'
        case 'aprobado con observaciones': return 'badge bg-warning text-dark'
        default: return 'badge bg-secondary'
    }
}

onMounted(() => {
    tema.value = temas.find(t => t.idTema === temaId)

    if (tema.value) {
        estudiante.value = usuarios.find(u => u.idUsuario === tema.value.idEstudiante)
    }

    const asignaciones = asignacionTribunal.filter(a => a.idTema === temaId)

    tribunalesAsignados.value = asignaciones.map(a => {
        const tribunal = usuarios.find(u => u.idUsuario === a.idTribunal)
        return {
            nombreCompleto: `${tribunal.primer_apellido} ${tribunal.segundo_apellido}, ${tribunal.nombres}`,
            especialidad: tribunal.especialidad,
            veredicto: a.veredicto || 'pendiente'
        }
    })
})
</script>

<template>
    <section class="container mt-4">
        <h2 class="fw-bold mb-4 text-center">Detalle del Tema</h2>

        <!-- Información del tema -->
        <div class="card shadow mb-4">
            <div class="card-header bg-primary text-white fw-bold text-uppercase">
                Información del Tema
            </div>
            <div class="card-body px-4 py-4">
                <div class="row mb-3">
                    <div class="col-md-6 mb-3">
                        <label class="fw-semibold text-muted">Nombre del tema</label>
                        <div class="border rounded p-2 bg-light text-dark">
                            {{ tema?.nombre || 'Sin información' }}
                        </div>
                    </div>
                    <div class="col-md-6 mb-3 text-center">
                        <label class="fw-semibold text-muted d-block">Estado del tema</label>
                        <div class="d-flex justify-content-center">
                            <span :class="['badge', 'px-3', 'py-2', claseEstadoTema(tema?.estado)]">
                                {{ tema?.estado?.toUpperCase() || 'SIN ESTADO' }}
                            </span>
                        </div>
                    </div>

                </div>

                <div class="row">
                    <div class="col-md-12">
                        <label class="fw-semibold text-muted">Estudiante responsable</label>
                        <div class="border rounded p-2 bg-light text-dark">
                            {{ estudiante
                                ? `${estudiante.primer_apellido} ${estudiante.segundo_apellido}, ${estudiante.nombres}`
                                : 'No asignado' }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tribunal asignado -->
        <div class="card shadow">
            <div class="card-header bg-secondary text-white fw-bold">Tribunales Asignados</div>
            <div class="card-body px-4 py-3">
                <div v-if="tribunalesAsignados.length > 0" class="table-responsive">
                    <table class="table table-bordered table-striped align-middle">
                        <thead class="table-dark text-center">
                            <tr>
                                <th>Nombre completo</th>
                                <th>Especialidad</th>
                                <th>Veredicto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(t, i) in tribunalesAsignados" :key="i" class="text-center">
                                <td>{{ t.nombreCompleto }}</td>
                                <td>{{ t.especialidad }}</td>
                                <td>
                                    <span :class="claseVeredicto(t.veredicto)">
                                        {{ t.veredicto.toUpperCase() }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="alert alert-warning text-center">
                    Este tema aún no tiene tribunales asignados.
                </div>
            </div>
        </div>
    </section>
</template>
