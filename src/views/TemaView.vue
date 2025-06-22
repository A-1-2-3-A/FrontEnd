<script setup>
import { ref, computed } from 'vue'
import { temas } from '@/data/temas.js'

const busqueda = ref('')

// 1. Filtrar solo los temas aprobados
const temasAprobados = computed(() => {
    return temas.filter(tema => tema.estado === 'aprobado');
});

// 2. Filtrar la lista de temas aprobados según la búsqueda
const temasFiltrados = computed(() => {
    const criterio = busqueda.value.trim().toLowerCase()
    if (!criterio) return temasAprobados.value

    return temasAprobados.value.filter(t =>
        t.nombre.toLowerCase().includes(criterio)
    )
})

// Función para formatear fechas
const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    // Simulación: en una app real, la fecha de aprobación estaría en los datos del tema
    return new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}
</script>

<template>
    <!-- **CORRECCIÓN**: Se elimina el margen superior 'mt-4' del contenedor principal -->
    <section class="container-fluid pt-4" style="max-width: 960px;">
        <!-- Encabezado de la página -->
        <div class="text-center mb-4">
            <!-- **TÍTULO CORREGIDO** -->
            <h2 class="text-dark-emphasis fw-bold mb-0">Temas Aprobados</h2>
        </div>

        <!-- Barra de Búsqueda -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control bg-light border-0" placeholder="Buscar por nombre de tema..." v-model="busqueda" />
                </div>
            </div>
        </div>

        <!-- Tabla de temas con estilo mejorado -->
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th class="ps-4" style="width: 70%;">Nombre del Tema</th>
                                <!-- **NUEVA COLUMNA** -->
                                <th class="text-center" style="width: 30%;">Fecha de Aprobación</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(tema, index) in temasFiltrados" :key="tema.idTema">
                                <td class="ps-4">
                                    <span class="text-muted me-3">{{ index + 1 }}.</span>
                                    <span class="fw-medium">{{ tema.nombre }}</span>
                                </td>
                                <td class="text-center text-muted small">
                                    <!-- **NUEVO DATO** -->
                                    {{ formatearFecha(tema.fechaAprobacion) }}
                                </td>
                            </tr>
                             <tr v-if="temasFiltrados.length === 0">
                                <td colspan="2" class="text-center text-muted p-5">
                                    <i class="bi bi-search-heart fs-1"></i>
                                    <p class="mt-2 mb-0">No se encontraron temas aprobados.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>