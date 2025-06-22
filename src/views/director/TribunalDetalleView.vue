<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usuarios } from '@/data/usuarios.js';
import { temas } from '@/data/temas.js';
import { asignacionTribunal } from '@/data/asignacionTribunal.js';

const route = useRoute();
const tribunalId = parseInt(route.params.id);

// Estados para los datos
const tribunal = ref(null);
const temasAsignados = ref([]);

// Formateador de fecha para que se vea bien
const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
};

onMounted(() => {
    // 1. Obtener los detalles del tribunal seleccionado
    tribunal.value = usuarios.find(u => u.idUsuario === tribunalId);

    // 2. Encontrar todas las asignaciones para este tribunal
    const asignaciones = asignacionTribunal.filter(a => a.idTribunal === tribunalId);

    // 3. Para cada asignación, buscar los detalles del tema y del estudiante
    temasAsignados.value = asignaciones
        .map(asignacion => {
            const tema = temas.find(t => t.idTema === asignacion.idTema);
            if (!tema) return null; // Si no se encuentra el tema, se omite

            const estudiante = usuarios.find(u => u.idUsuario === tema.idEstudiante);
            
            // Se omiten los temas en estado 'preliminar'
            if (tema.estado === 'preliminar') {
                return null;
            }

            return {
                nombre_tema: tema.nombre,
                estudiante_responsable: estudiante ? `${estudiante.nombres} ${estudiante.primer_apellido}` : 'Desconocido',
                veredicto: asignacion.veredicto || 'PENDIENTE',
                fecha_veredicto: asignacion.fecha_veredicto || null
            };
        })
        .filter(tema => tema !== null); // Se eliminan las entradas nulas
});
</script>

<template>
    <section class="container mt-4">
        <div v-if="tribunal">
            <h2 class="fw-bold mb-4 text-center">Detalle del Tribunal</h2>

            <!-- Información del Tribunal -->
            <div class="card shadow mb-4">
                <div class="card-header bg-primary text-white fw-bold">Información del Tribunal</div>
                <div class="card-body px-4 py-3">
                    <p><strong>Nombre:</strong> {{ tribunal.nombres }} {{ tribunal.primer_apellido }} {{ tribunal.segundo_apellido }}</p>
                    <p><strong>Correo:</strong> {{ tribunal.usuario }}</p>
                    <p><strong>Rol:</strong> {{ tribunal.rol }}</p>
                    <p><strong>Especialidad:</strong> {{ tribunal.especialidad || 'No especificada' }}</p>
                </div>
            </div>

            <!-- Tabla de Temas Asignados -->
            <div class="card shadow">
                <div class="card-header bg-secondary text-white fw-bold">Temas Asignados</div>
                <div class="card-body px-4 py-3">
                    <div v-if="temasAsignados.length > 0" class="table-responsive">
                        <table class="table table-bordered table-striped align-middle">
                            <thead class="table-dark text-center">
                                <tr>
                                    <th>Nombre del Tema</th>
                                    <th>Estudiante Responsable</th>
                                    <th>Veredicto Emitido</th>
                                    <th>Fecha del Veredicto</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(tema, i) in temasAsignados" :key="i" class="text-center">
                                    <td>{{ tema.nombre_tema }}</td>
                                    <td>{{ tema.estudiante_responsable }}</td>
                                    <td><span class="badge bg-info text-dark">{{ tema.veredicto }}</span></td>
                                    <td>{{ formatearFecha(tema.fecha_veredicto) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="text-center text-muted p-4">
                        Este tribunal no tiene temas asignados actualmente.
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="alert alert-danger text-center">
            No se pudo encontrar la información del tribunal solicitado.
        </div>
    </section>
</template>