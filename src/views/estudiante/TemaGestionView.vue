<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'
import { asignacionTribunal } from '@/data/asignacionTribunal.js'

const route = useRoute()
const temaId = parseInt(route.params.id)

// --- ESTADO DEL COMPONENTE ---
const tema = ref(null)
const tribunalesConEstado = ref([])
const estadoGeneralTema = ref('Calculando...')

// --- LÓGICA AL MONTAR EL COMPONENTE ---
onMounted(() => {
    tema.value = temas.find(t => t.idTema === temaId)
    if (!tema.value) return;

    // 1. Encontrar las asignaciones para este tema
    const asignaciones = asignacionTribunal.filter(a => a.idTema === temaId);

    // 2. Crear una lista enriquecida de tribunales con su estado de revisión
    tribunalesConEstado.value = asignaciones.map(asignacion => {
        const tribunalInfo = usuarios.find(u => u.idUsuario === asignacion.idTribunal);
        return {
            idTribunal: tribunalInfo.idUsuario,
            nombreCompleto: `${tribunalInfo.nombres} ${tribunalInfo.primer_apellido}`,
            veredicto: asignacion.veredicto || 'PENDIENTE'
        };
    });

    // 3. Calcular el estado general del tema basado en los veredictos individuales
    const veredictos = tribunalesConEstado.value.map(t => t.veredicto);
    if (veredictos.includes('REPROBADO')) {
        estadoGeneralTema.value = 'REPROBADO';
    } else if (veredictos.includes('REVISADO')) {
        estadoGeneralTema.value = 'REVISADO';
    } else if (veredictos.every(v => v === 'APROBADO')) {
        estadoGeneralTema.value = 'APROBADO';
    } else {
        estadoGeneralTema.value = 'PENDIENTE';
    }
});

// --- FUNCIONES AUXILIARES PARA LA VISTA ---
const getVeredictoInfo = (veredicto) => {
    switch (veredicto) {
        case 'APROBADO':
            return { clase: 'bg-success text-white', texto: 'Revisión completada' };
        case 'REPROBADO':
            return { clase: 'bg-danger text-white', texto: 'Revisión completada' };
        case 'REVISADO':
            return { clase: 'bg-warning text-dark', texto: 'Requiere tu acción' };
        default:
            return { clase: 'bg-secondary text-white', texto: 'Pendiente de revisión' };
    }
}
</script>

<template>
    <section class="container mt-4">
        <div v-if="tema">
            <h2 class="fw-bold text-center mb-2">Gestión del Tema</h2>
            <p class="text-center text-muted fs-5 mb-4">{{ tema.nombre }}</p>

            <!-- Estado General del Tema -->
            <div class="card shadow-sm mb-4">
                <div class="card-body text-center">
                    <h5 class="card-title">Estado General</h5>
                    <span :class="['badge', 'fs-6', 'px-3', 'py-2', getVeredictoInfo(estadoGeneralTema).clase]">
                        {{ estadoGeneralTema }}
                    </span>
                </div>
            </div>

            <!-- Panel de Tribunales -->
            <div class="card shadow-sm">
                <div class="card-header fw-bold bg-dark text-white">
                    Estado de Revisión por Tribunal
                </div>
                <ul class="list-group list-group-flush">
                    <li v-for="tribunal in tribunalesConEstado" :key="tribunal.idTribunal"
                        class="list-group-item d-flex justify-content-between align-items-center flex-wrap p-3">
                        
                        <div class="fw-semibold">
                            {{ tribunal.nombreCompleto }}
                        </div>

                        <div class="d-flex align-items-center gap-3 mt-2 mt-md-0">
                            <span :class="['badge', getVeredictoInfo(tribunal.veredicto).clase]">
                                {{ tribunal.veredicto }}
                            </span>
                            <span class="text-muted fst-italic small">
                                {{ getVeredictoInfo(tribunal.veredicto).texto }}
                            </span>
                            <router-link
                                :to="{ name: 'ETemaTribunalView', params: { temaId: temaId, id: tribunal.idTribunal } }"
                                class="btn btn-sm btn-outline-primary">
                                Ver / Gestionar
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else class="alert alert-danger">
            No se encontró el tema solicitado.
        </div>
    </section>
</template>