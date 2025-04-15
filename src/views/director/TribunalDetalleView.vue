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

onMounted(() => {
    // Obtener el tema
    tema.value = temas.find(t => t.idTema === temaId)

    // Obtener estudiante del tema
    if (tema.value) {
        estudiante.value = usuarios.find(u => u.idUsuario === tema.value.idEstudiante)
    }

    // Obtener tribunales asignados a este tema
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

        <!-- Información del tema y estudiante -->
        <div class="card shadow mb-4">
            <div class="card-header bg-primary text-white fw-bold">Información del tema</div>
            <div class="card-body px-4 py-3">
                <p><strong>Nombre del tema:</strong> {{ tema?.nombre }}</p>
                <p><strong>Estado:</strong> {{ tema?.estado }}</p>
                <p>
                    <strong>Estudiante:</strong>
                    {{ estudiante ? `${estudiante.primer_apellido} ${estudiante.segundo_apellido},
                    ${estudiante.nombres}` : 'Desconocido' }}
                </p>
            </div>
        </div>

        <!-- Tabla de tribunales -->
        <div class="card shadow">
            <div class="card-header bg-secondary text-white fw-bold">Tribunales Asignados</div>
            <div class="card-body px-4 py-3">
                <div class="table-responsive">
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
                                <td>{{ t.veredicto }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>
