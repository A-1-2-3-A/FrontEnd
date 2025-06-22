<script setup>
import { ref, computed, onMounted } from 'vue'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'
import { asignacionTribunal } from '@/data/asignacionTribunal.js'
import { useAuthStore } from '@/stores/auth'

const busqueda = ref('')
const todosLosTemasAsignados = ref([])
const authStore = useAuthStore()
const gestionSeleccionada = ref('actual'); 

onMounted(() => {
    const idTribunalLogueado = authStore.usuario?.id || 2; 
    const misAsignaciones = asignacionTribunal.filter(a => a.idTribunal === idTribunalLogueado);
    
    todosLosTemasAsignados.value = misAsignaciones.map(asignacion => {
        const tema = temas.find(t => t.idTema === asignacion.idTema);
        const estudiante = usuarios.find(u => u.idUsuario === tema.idEstudiante);
        
        const fechaAsignacion = tema.fechaAsignacion || new Date().toISOString();
        const gestion = `${fechaAsignacion.substring(0, 4)}-${new Date(fechaAsignacion).getMonth() < 6 ? 'I' : 'II'}`;
        
        return {
            ...tema,
            nombreEstudiante: estudiante ? `${estudiante.nombres} ${estudiante.primer_apellido}` : 'No asignado',
            gestion: gestion
        };
    });
});

const gestionesDisponibles = computed(() => {
    const gestiones = new Set(todosLosTemasAsignados.value.map(t => t.gestion));
    return ['actual', ...Array.from(gestiones)].sort((a, b) => b.localeCompare(a));
});

const temasFiltrados = computed(() => {
    let temasPorGestion = [];
    
    if (gestionSeleccionada.value === 'actual') {
        const estadosActuales = ['pendiente', 'en revision', 'revisado'];
        temasPorGestion = todosLosTemasAsignados.value.filter(t => estadosActuales.includes(t.estado.toLowerCase()));
    } else {
        temasPorGestion = todosLosTemasAsignados.value.filter(t => t.gestion === gestionSeleccionada.value);
    }

    const criterio = busqueda.value.trim().toLowerCase()
    if (!criterio) return temasPorGestion;

    return temasPorGestion.filter(t =>
        t.nombre.toLowerCase().includes(criterio) ||
        t.nombreEstudiante.toLowerCase().includes(criterio)
    )
})

const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
        case 'aprobado': return 'text-bg-success';
        case 'reprobado': return 'text-bg-danger';
        case 'revisado': return 'text-bg-warning text-dark';
        case 'en revision': return 'text-bg-info';
        case 'pendiente': return 'text-bg-primary';
        default: return 'text-bg-secondary';
    }
}
</script>

<template>
    <section class="container-fluid mt-4">
        <!-- Encabezado de la página con TÍTULO CENTRADO -->
        <div class="text-center mb-4">
             <h2 class="text-dark-emphasis fw-bold mb-0">Temas Asignados</h2>
        </div>
        
        <!-- **NUEVA FILA PARA CONTROLES** -->
        <div class="row mb-4 align-items-center">
            <!-- Barra de Búsqueda a la izquierda -->
            <div class="col-md-8">
                 <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" placeholder="Buscar en la gestión seleccionada..." v-model="busqueda" />
                </div>
            </div>
            <!-- Filtro de Gestión a la derecha -->
            <div class="col-md-4 d-flex justify-content-end">
                 <div class="d-flex align-items-center">
                    <label for="gestionSelect" class="form-label mb-0 me-2 fw-semibold text-nowrap">Ver Gestión:</label>
                    <select id="gestionSelect" class="form-select w-auto" v-model="gestionSeleccionada">
                        <option v-for="g in gestionesDisponibles" :key="g" :value="g">
                            {{ g === 'actual' ? 'En Curso' : g }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Tabla de temas -->
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
                                     <router-link :to="{ name: 'TTemaGestionView', params: { id: tema.idTema } }"
                                        class="btn btn-sm btn-outline-primary" title="Revisar tema">
                                        <i class="bi bi-journal-check me-1"></i> Revisar Tema
                                    </router-link>
                                </td>
                            </tr>
                             <tr v-if="temasFiltrados.length === 0">
                                <td colspan="3" class="text-center text-muted p-4">No hay temas para mostrar en esta gestión.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>