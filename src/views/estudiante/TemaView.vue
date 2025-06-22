<script setup>
import { ref, computed, onMounted } from 'vue'
import { temas } from '@/data/temas.js'
import { useAuthStore } from '@/stores/auth'

const busqueda = ref('')
const misTemas = ref([])
const authStore = useAuthStore()

onMounted(() => {
    // 1. Simular que obtenemos el ID del estudiante que ha iniciado sesión
    const idEstudianteLogueado = authStore.usuario?.id || 8; // Usamos el ID del store o un ID de ejemplo

    // 2. Filtrar la lista de temas para mostrar solo los de este estudiante
    misTemas.value = temas.filter(t => t.idEstudiante === idEstudianteLogueado);
});


const temasFiltrados = computed(() => {
    const criterio = busqueda.value.trim().toLowerCase()
    if (!criterio) return misTemas.value

    return misTemas.value.filter(t =>
        t.nombre.toLowerCase().includes(criterio) ||
        t.estado.toLowerCase().includes(criterio)
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
        <!-- Encabezado de la página con TÍTULO CORREGIDO -->
        <div class="text-center mb-4">
            <h2 class="text-dark-emphasis fw-bold mb-0">Temas</h2>
        </div>

        <!-- Barra de Búsqueda -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" placeholder="Buscar por nombre de tema o estado..." v-model="busqueda" />
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
                                <th class="ps-4" style="width: 70%;">Nombre del Tema</th>
                                <th class="text-center">Estado</th>
                                <th class="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tema in temasFiltrados" :key="tema.idTema">
                                <td class="ps-4 fw-semibold">{{ tema.nombre }}</td>
                                <td class="text-center">
                                    <span class="badge rounded-pill" :class="getEstadoClass(tema.estado)">
                                        {{ tema.estado.toUpperCase() }}
                                    </span>
                                </td>
                                <td class="text-center">
                                     <router-link :to="{ name: 'ETemaGestionView', params: { id: tema.idTema } }"
                                        class="btn btn-sm btn-outline-primary" title="Ver gestión del tema">
                                        <i class="bi bi-clipboard2-data-fill me-1"></i> Gestionar
                                    </router-link>
                                </td>
                            </tr>
                             <tr v-if="temasFiltrados.length === 0">
                                <td colspan="3" class="text-center text-muted p-4">No has registrado ningún tema.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>