<script setup>
import { ref, computed } from 'vue'
import { usuarios } from '@/data/usuarios.js'

const busqueda = ref('')

// Filtra directamente los usuarios que son tribunales
const tribunales = computed(() => 
    usuarios.filter(usuario => usuario.rol === 'tribunal')
);

// Filtra la lista de tribunales según la búsqueda
const tribunalesFiltrados = computed(() => {
    const criterio = busqueda.value.trim().toLowerCase()
    if (!criterio) return tribunales.value

    return tribunales.value.filter(tribunal =>
        [tribunal.nombres, tribunal.primer_apellido, tribunal.segundo_apellido, tribunal.especialidad]
            .some(campo => campo.toLowerCase().includes(criterio))
    )
})
</script>

<template>
    <section class="container-fluid mt-4">
        <!-- Encabezado de la página con TÍTULO CENTRADO -->
        <div class="text-center mb-4">
            <h2 class="text-dark-emphasis fw-bold mb-0">Gestión de Tribunales</h2>
        </div>

        <!-- Barra de Búsqueda y Botón Añadir -->
        <div class="d-flex justify-content-between align-items-center mb-4">
             <div class="input-group" style="max-width: 400px;">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Buscar por nombre, apellido o especialidad..." v-model="busqueda" />
            </div>
            <router-link :to="{ name: 'DDesTribunalView' }" class="btn btn-primary d-flex align-items-center">
                <i class="bi bi-people-fill me-2"></i> Designar Tribunales
            </router-link>
        </div>

        <!-- Tabla de tribunales con estilo mejorado -->
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-striped align-middle mb-0">
                        <thead class="table-dark">
                            <tr class="text-center">
                                <th>Nombre Completo</th>
                                <th>Especialidad</th>
                                <th>Temas Asignados</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tribunal in tribunalesFiltrados" :key="tribunal.idUsuario">
                                <td>
                                    <div class="px-3">
                                        {{ tribunal.primer_apellido }} {{ tribunal.segundo_apellido }}, {{ tribunal.nombres }}
                                    </div>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">
                                        {{ tribunal.especialidad }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-primary rounded-circle" style="width: 2rem; height: 2rem; line-height: 1.5rem; font-size: 0.9rem;">
                                        {{ tribunal.perfiles || 0 }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <router-link :to="{ name: 'DTribunalDetalleView', params: { id: tribunal.idUsuario } }"
                                        class="btn btn-sm btn-outline-info" title="Ver detalle del tribunal">
                                        <i class="bi bi-eye-fill"></i> Ver Detalle
                                    </router-link>
                                </td>
                            </tr>
                            <tr v-if="tribunalesFiltrados.length === 0">
                                <td colspan="4" class="text-center text-muted p-4">No se encontraron tribunales con ese criterio.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>