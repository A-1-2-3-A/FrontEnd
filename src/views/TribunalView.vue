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
            .some(campo => campo && campo.toLowerCase().includes(criterio))
    )
})
</script>

<template>
    <section class="container-fluid mt-4" style="max-width: 960px;">
        <!-- Encabezado de la página con TÍTULO CORREGIDO Y CENTRADO -->
        <div class="text-center mb-4">
            <h2 class="text-dark-emphasis fw-bold mb-0">Tribunales</h2>
        </div>

        <!-- Barra de Búsqueda -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="input-group">
                    <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control bg-light border-0" placeholder="Buscar por nombre, apellido o especialidad..." v-model="busqueda" />
                </div>
            </div>
        </div>

        <!-- Tabla de tribunales con estilo mejorado -->
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr class="text-center">
                                <th class="ps-4 text-start" style="width: 50%;">Nombre Completo</th>
                                <th class="text-center" style="width: 50%;">Especialidad Principal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="tribunal in tribunalesFiltrados" :key="tribunal.idUsuario">
                                <td class="ps-4">
                                    <p class="mb-0 fw-medium">{{ tribunal.primer_apellido }} {{ tribunal.segundo_apellido }}, {{ tribunal.nombres }}</p>
                                </td>
                                <td class="text-center">
                                    <span class="badge bg-primary-subtle text-primary-emphasis rounded-pill px-3 py-2">
                                        {{ tribunal.especialidad }}
                                    </span>
                                </td>
                            </tr>
                             <tr v-if="tribunalesFiltrados.length === 0">
                                <td colspan="2" class="text-center text-muted p-5">
                                    <i class="bi bi-search-heart fs-1"></i>
                                    <p class="mt-2 mb-0">No se encontraron tribunales con ese criterio.</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>