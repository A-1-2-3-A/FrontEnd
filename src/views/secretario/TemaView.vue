<script setup>
import { ref, computed } from 'vue'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'
import { useModalStore } from '@/stores/modal'

const busqueda = ref('')
const modalStore = useModalStore()

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

// Simulación de eliminar un tema
const eliminarTema = (idTema) => {
    modalStore.showModal({
        title: 'Confirmación',
        message: '¿Está seguro de que desea eliminar este tema? Esta acción no se puede deshacer.',
        type: 'warning',
        // En una implementación real, aquí se añadirían botones de "Confirmar" y "Cancelar"
        // y se llamaría a la API al confirmar.
    });
    console.log(`Simulando eliminación del tema con ID: ${idTema}`);
}
</script>

<template>
    <section class="container-fluid mt-4">
        <!-- Encabezado de la página -->
        <div class="text-center mb-4">
            <h2 class="text-dark-emphasis fw-bold mb-0">Gestión de Temas</h2>
        </div>

        <!-- Barra de Búsqueda y Botón Añadir -->
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="input-group" style="max-width: 400px;">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Buscar por nombre de tema, estudiante o estado..." v-model="busqueda" />
            </div>
            <router-link :to="{ name: 'STemaAdicionarView' }" class="btn btn-primary d-flex align-items-center">
                <i class="bi bi-file-earmark-plus-fill me-2"></i> Añadir Tema
            </router-link>
        </div>

        <!-- Tabla de temas con columna de Acciones -->
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
                                    <!-- **NUEVO**: Botones condicionales -->
                                    <div v-if="tema.estado === 'preliminar'" class="btn-group">
                                        <router-link :to="{ name: 'STemaModificarView', params: { id: tema.idTema } }" class="btn btn-sm btn-outline-primary" title="Modificar">
                                            <i class="bi bi-pencil-fill"></i>
                                        </router-link>
                                        <button @click="eliminarTema(tema.idTema)" class="btn btn-sm btn-outline-danger" title="Eliminar">
                                            <i class="bi bi-trash-fill"></i>
                                        </button>
                                    </div>
                                    <span v-else class="text-muted fst-italic">--</span>
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