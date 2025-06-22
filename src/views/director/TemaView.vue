<script setup>
import { ref, computed } from 'vue'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'

const busqueda = ref('')

// Unimos los datos de temas y usuarios para tener toda la información
const temasConDetalles = computed(() => {
    return temas.map(tema => {
        const estudiante = usuarios.find(u => u.idUsuario === tema.idEstudiante);
        return {
            ...tema,
            nombreEstudiante: estudiante ? `${estudiante.nombres} ${estudiante.primer_apellido}` : 'No asignado'
        };
    });
});

const temasFiltrados = computed(() => {
    const criterio = busqueda.value.trim().toLowerCase()
    if (!criterio) return temasConDetalles.value

    return temasConDetalles.value.filter(t =>
        t.nombre.toLowerCase().includes(criterio) ||
        t.estado.toLowerCase().includes(criterio) ||
        t.nombreEstudiante.toLowerCase().includes(criterio)
    )
})

// Función para obtener una clase de color para cada estado
const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
        case 'aprobado': return 'text-bg-success';
        case 'reprobado': return 'text-bg-danger';
        case 'revisado': return 'text-bg-warning';
        case 'en revision': return 'text-bg-info';
        case 'pendiente': return 'text-bg-primary';
        default: return 'text-bg-secondary';
    }
}
</script>

<template>
    <section class="container-fluid mt-4">
        <!-- Encabezado de la página -->
        <div class="text-center mb-4">
            <h2 class="text-dark-emphasis fw-bold mb-0">Gestión de Temas</h2>
        </div>

        <!-- Barra de Búsqueda -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" placeholder="Buscar por nombre de tema, estudiante o estado..." v-model="busqueda" />
                </div>
            </div>
        </div>

        <!-- Tabla de temas con estilo mejorado -->
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-striped align-middle mb-0">
                        <thead class="table-dark">
                            <tr>
                                <th class="ps-4" style="width: 50%;">Tema / Estudiante</th>
                                <th class="text-center">Estado</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tema in temasFiltrados" :key="tema.idTema">
                                <td class="ps-4">
                                    <p class="fw-semibold mb-1">{{ tema.nombre }}</p>
                                    <p class="text-muted mb-0 small">{{ tema.nombreEstudiante }}</p>
                                </td>
                                <td class="text-center">
                                    <span class="badge rounded-pill" :class="getEstadoClass(tema.estado)">
                                        {{ tema.estado.toUpperCase() }}
                                    </span>
                                </td>
                                <td class="text-center">
                                     <router-link :to="{ name: 'DTemaDetalleView', params: { id: tema.idTema } }"
                                        class="btn btn-sm btn-outline-primary" title="Ver detalle del tema">
                                        <i class="bi bi-eye-fill me-1"></i> Ver Detalle
                                    </router-link>
                                </td>
                            </tr>
                             <tr v-if="temasFiltrados.length === 0">
                                <td colspan="3" class="text-center text-muted p-4">No se encontraron temas.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>