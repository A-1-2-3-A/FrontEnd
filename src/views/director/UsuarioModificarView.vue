<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usuarios } from '@/data/usuarios.js'

const route = useRoute()
const idUsuario = parseInt(route.params.id)
const usuarioData = ref(null)

// --- ESTADO DEL FORMULARIO ---
const usuario = ref('')
const nombres = ref('')
const primerApellido = ref('')
const segundoApellido = ref('')
const rol = ref('')

const especialidadesDisponibles = ref(['Desarrollo de software', 'Telemática', 'Gestión empresarial']);
const especialidadesSeleccionadas = ref([]);
const tipo = ref('')


// --- LÓGICA AL MONTAR EL COMPONENTE ---
onMounted(() => {
    usuarioData.value = usuarios.find(u => u.idUsuario === idUsuario)

    if (usuarioData.value) {
        usuario.value = usuarioData.value.usuario
        nombres.value = usuarioData.value.nombres
        primerApellido.value = usuarioData.value.primer_apellido
        segundoApellido.value = usuarioData.value.segundo_apellido
        rol.value = usuarioData.value.rol
        tipo.value = usuarioData.value.tipo || ''

        if((usuarioData.value.rol === 'tribunal' || usuarioData.value.rol === 'director') && usuarioData.value.especialidad) {
            especialidadesSeleccionadas.value = [usuarioData.value.especialidad];
        }
    }
})

const puedeCambiarRol = computed(() => {
    return rol.value === 'director' || rol.value === 'tribunal';
});

</script>

<template>
    <section class="container mt-4">
        <form v-if="usuarioData" class="w-100" style="max-width: 600px; margin: auto;">
            <!-- Recuadro Principal de Información -->
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white fw-bold text-center">
                    Modificar Usuario
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label">Nombres</label>
                        <input type="text" v-model="nombres" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Primer Apellido</label>
                        <input type="text" v-model="primerApellido" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Segundo Apellido</label>
                        <input type="text" v-model="segundoApellido" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" v-model="usuario" class="form-control" disabled readonly />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <select v-model="rol" class="form-select" :disabled="!puedeCambiarRol">
                            <option v-if="puedeCambiarRol" value="director">Director</option>
                            <option v-if="puedeCambiarRol" value="tribunal">Tribunal</option>
                            <option v-if="rol === 'secretario'" value="secretario">Secretario</option>
                            <option v-if="rol === 'estudiante'" value="estudiante">Estudiante</option>
                        </select>
                         <small v-if="!puedeCambiarRol" class="form-text text-muted">El rol para Secretarios y Estudiantes no se puede modificar.</small>
                    </div>

                    <!-- Campos condicionales -->
                    <div v-if="rol === 'director' || rol === 'tribunal'" class="mb-3">
                        <label class="form-label">Especialidades</label>
                         <div class="border rounded p-2 bg-light">
                             <div v-for="esp in especialidadesDisponibles" :key="esp" class="form-check form-check-inline">
                                 <input class="form-check-input" type="checkbox" :value="esp" v-model="especialidadesSeleccionadas" :id="`esp-${esp}`">
                                 <label class="form-check-label" :for="`esp-${esp}`">{{ esp }}</label>
                             </div>
                         </div>
                    </div>
                     <div v-if="rol === 'estudiante'" class="mb-3">
                         <label class="form-label">Tipo de Estudiante</label>
                          <select v-model="tipo" class="form-select">
                              <option value="" disabled>Seleccione tipo</option>
                              <option value="regular">Regular</option>
                              <option value="egresado">Egresado</option>
                          </select>
                     </div>
                </div>
            </div>

            <!-- **SECCIÓN DE CONTRASEÑA ELIMINADA** -->

            <!-- Botón guardar -->
            <div class="text-center">
                <button class="btn btn-success px-5">Guardar Cambios</button>
            </div>
        </form>
         <div v-else class="alert alert-danger text-center">
            No se pudo encontrar al usuario para modificar.
        </div>
    </section>
</template>