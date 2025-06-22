<script setup>
import { ref, computed, watch } from 'vue'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'
import { asignacionTribunal } from '@/data/asignacionTribunal.js'
import { useModalStore } from '@/stores/modal';

// --- ESTADO DEL COMPONENTE ---
const temaSeleccionadoId = ref(null);
const tribunalSeleccionados = ref([]);
const textoBusqueda = ref('');
const temasDisponibles = ref([]);
const modalStore = useModalStore();

// --- LÓGICA DE DATOS (SIMULADA) ---
// Al montar, se cargan los temas pendientes
temasDisponibles.value = temas.filter(t => t.estado === 'preliminar');

// Contar los temas asignados a cada tribunal
const conteoTemasPorTribunal = computed(() => {
    const conteo = {};
    for (const asignacion of asignacionTribunal) {
        conteo[asignacion.idTribunal] = (conteo[asignacion.idTribunal] || 0) + 1;
    }
    return conteo;
});

const todosLosTribunales = computed(() => {
    return usuarios
        .filter(u => u.rol === 'tribunal')
        .map(tribunal => ({
            ...tribunal,
            temasAsignados: conteoTemasPorTribunal.value[tribunal.idUsuario] || 0
        }));
});

const tribunalesFiltrados = computed(() => {
    if (!textoBusqueda.value.trim()) {
        return todosLosTribunales.value;
    }
    const criterio = textoBusqueda.value.toLowerCase();
    return todosLosTribunales.value.filter(t =>
        `${t.nombres} ${t.primer_apellido} ${t.segundo_apellido}`.toLowerCase().includes(criterio)
    );
});

// Limpiar la selección de tribunales si cambia el tema
watch(temaSeleccionadoId, () => {
    tribunalSeleccionados.value = [];
});

// --- LÓGICA DE INTERACCIÓN ---
function toggleTribunal(id) {
    const index = tribunalSeleccionados.value.indexOf(id);
    if (index > -1) {
        tribunalSeleccionados.value.splice(index, 1);
    } else if (tribunalSeleccionados.value.length < 3) {
        tribunalSeleccionados.value.push(id);
    }
}

function designarTribunales() {
    if (!temaSeleccionadoId.value || tribunalSeleccionados.value.length !== 3) {
        modalStore.showModal({
            title: 'Error de Validación',
            message: 'Debe seleccionar un tema y exactamente 3 tribunales.',
            type: 'error'
        });
        return;
    }

    modalStore.showModal({
        title: 'Designación Exitosa',
        message: `Los tribunales han sido asignados correctamente al tema.`,
        type: 'success'
    });

    temasDisponibles.value = temasDisponibles.value.filter(t => t.idTema !== temaSeleccionadoId.value);
    
    temaSeleccionadoId.value = null;
    tribunalSeleccionados.value = [];
    textoBusqueda.value = '';
}
</script>

<template>
    <section class="container mt-4">
        <h2 class="fw-bold mb-4 text-center">Designación de Tribunales</h2>

        <div class="card shadow-sm">
            <div class="card-body p-4">
                <!-- 1. Selección de Tema -->
                <div class="mb-4">
                    <label for="temaSelect" class="form-label fw-semibold">Seleccione un tema pendiente de asignación:</label>
                    <select id="temaSelect" class="form-select" v-model="temaSeleccionadoId">
                        <option :value="null" disabled>-- Elija un tema --</option>
                        <option v-for="t in temasDisponibles" :key="t.idTema" :value="t.idTema">
                            {{ t.nombre }}
                        </option>
                    </select>
                </div>

                <!-- 2. Selección de Tribunales -->
                <div class="mb-4">
                    <label for="buscarTribunal" class="form-label fw-semibold">Seleccione 3 tribunales:</label>
                    <input id="buscarTribunal" type="text" v-model="textoBusqueda" placeholder="Buscar tribunal por nombre o apellido..." class="form-control mb-2" />
                    
                    <div class="list-group tribunal-list">
                        <div v-for="t in tribunalesFiltrados" :key="t.idUsuario"
                            class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                            :class="{ 'active': tribunalSeleccionados.includes(t.idUsuario) }"
                            @click="toggleTribunal(t.idUsuario)">
                            
                            <div>
                                <span class="fw-semibold">{{ t.primer_apellido }} {{ t.segundo_apellido }},</span> {{ t.nombres }}
                                <br>
                                <small class="text-muted">Especialidad: {{ t.especialidad }}</small>
                            </div>
                            
                            <div class="text-end">
                                <span class="badge bg-secondary rounded-pill me-3">
                                    Asignados: {{ t.temasAsignados }}
                                </span>
                                <i v-if="tribunalSeleccionados.includes(t.idUsuario)" class="bi bi-check-circle-fill fs-4 text-white"></i>
                            </div>
                        </div>
                         <div v-if="tribunalesFiltrados.length === 0" class="list-group-item text-muted text-center">
                            No se encontraron tribunales.
                        </div>
                    </div>
                    <small class="text-muted mt-1 d-block text-end">Seleccionados: {{ tribunalSeleccionados.length }} / 3</small>
                </div>
                
                <div class="text-center mt-4">
                    <button class="btn btn-primary px-5" @click="designarTribunales" :disabled="!temaSeleccionadoId || tribunalSeleccionados.length !== 3">
                        Designar
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.tribunal-list {
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #dee2e6;
    border-radius: .375rem;
}
.list-group-item-action {
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}
.list-group-item.active {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
}
.list-group-item.active .text-muted {
    color: rgba(255, 255, 255, 0.75) !important;
}
</style>