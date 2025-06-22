<script setup>
import { ref, onMounted } from 'vue'

// Campos del formulario
const usuario = ref('')
const clave = ref('')
const repetirClave = ref('')
const nombres = ref('')
const primerApellido = ref('')
const segundoApellido = ref('')
const fechaNacimiento = ref('') // Nuevo campo para fecha de nacimiento
const rol = ref('')
const fechaRegistro = ref('')

onMounted(() => {
    const ahora = new Date()
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    fechaRegistro.value = ahora.toLocaleDateString('es-ES', options);
})

// Campos dependientes del rol
const especialidadesDisponibles = ref(['Desarrollo de software', 'Telemática', 'Gestión empresarial']);
const especialidadesSeleccionadas = ref([]);
const tipo = ref('')

</script>

<template>
    <section class="container mt-4">
        <form class="card shadow-sm w-100" style="max-width: 600px; margin: auto;">
            <div class="card-header bg-primary text-white fw-bold text-center">
                Agregar Nuevo Usuario
            </div>
            <div class="card-body p-4">
                <div class="mb-3">
                    <label for="nombres" class="form-label">Nombres</label>
                    <input id="nombres" type="text" v-model="nombres" class="form-control" />
                </div>
                <div class="mb-3">
                    <label for="primerApellido" class="form-label">Primer Apellido</label>
                    <input id="primerApellido" type="text" v-model="primerApellido" class="form-control" />
                </div>
                <div class="mb-3">
                    <label for="segundoApellido" class="form-label">Segundo Apellido</label>
                    <input id="segundoApellido" type="text" v-model="segundoApellido" class="form-control" />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input id="email" type="email" v-model="usuario" class="form-control" placeholder="usuario@sistemas.edu.bo" />
                </div>
                <div class="mb-3">
                    <label for="clave" class="form-label">Contraseña</label>
                    <input id="clave" type="password" v-model="clave" class="form-control" />
                </div>
                <div class="mb-3">
                    <label for="repetirClave" class="form-label">Repetir Contraseña</label>
                    <input id="repetirClave" type="password" v-model="repetirClave" class="form-control" />
                </div>
                
                <!-- **NUEVO CAMPO: FECHA DE NACIMIENTO** -->
                <div class="mb-3">
                    <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                    <input id="fechaNacimiento" type="date" v-model="fechaNacimiento" class="form-control" />
                </div>

                <div class="mb-3">
                    <label for="rol" class="form-label">Rol</label>
                    <select id="rol" v-model="rol" class="form-select">
                        <option value="" disabled>Seleccione un rol</option>
                        <option value="tribunal">Tribunal</option>
                        <option value="secretario">Secretario</option>
                        <option value="estudiante">Estudiante</option>
                    </select>
                </div>

                <!-- Campos condicionales -->
                <div v-if="rol === 'tribunal'" class="mb-3">
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

                <!-- **CAMPO MEJORADO: FECHA DE REGISTRO** -->
                <div class="mb-3">
                    <label for="fechaRegistro" class="form-label">Fecha de Registro</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                        <input id="fechaRegistro" type="text" class="form-control" :value="fechaRegistro" disabled readonly />
                    </div>
                </div>

                <!-- Botón guardar -->
                <div class="text-center mt-4">
                    <button class="btn btn-success px-5">Guardar Usuario</button>
                </div>
            </div>
        </form>
    </section>
</template>