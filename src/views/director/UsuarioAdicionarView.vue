<script setup>
import { ref, watch } from 'vue'

// Campos del formulario
const usuario = ref('')
const clave = ref('')
const repetirClave = ref('')
const nombres = ref('')
const primerApellido = ref('')
const segundoApellido = ref('')
const rol = ref('')
const fechaRegistro = ref(new Date().toISOString().split('T')[0]) // yyyy-mm-dd
const estado = ref(true)

// Campos dependientes del rol
const gestion = ref('')
const especialidad = ref('')
const tipo = ref('')
const anioEntrada = ref('')
</script>

<template>
    <section class="container mt-4 d-flex flex-column align-items-center">
        <div class="card shadow w-100" style="max-width: 600px;">
            <div class="card-header bg-primary text-white fw-bold">
                Agregar nuevo usuario
            </div>

            <div class="card-body">
                <!-- Datos personales -->
                <div class="mb-3">
                    <label class="form-label text-start w-100">Nombres</label>
                    <input type="text" v-model="nombres" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label text-start w-100">Primer apellido</label>
                    <input type="text" v-model="primerApellido" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label text-start w-100">Segundo apellido</label>
                    <input type="text" v-model="segundoApellido" class="form-control" />
                </div>

                <!-- Usuario y contraseña -->
                <div class="mb-3">
                    <label class="form-label text-start w-100">Correo electrónico</label>
                    <input type="email" v-model="usuario" class="form-control" placeholder="usuario@sistemas.edu.bo" />
                </div>
                <div class="mb-3">
                    <label class="form-label text-start w-100">Contraseña</label>
                    <input type="password" v-model="clave" class="form-control" />
                </div>
                <div class="mb-3">
                    <label class="form-label text-start w-100">Repetir contraseña</label>
                    <input type="password" v-model="repetirClave" class="form-control" />
                </div>

                <!-- Rol -->
                <div class="mb-3">
                    <label class="form-label text-start w-100">Rol</label>
                    <select v-model="rol" class="form-select">
                        <option value="" disabled>Seleccione un rol</option>
                        <option value="director">Director</option>
                        <option value="tribunal">Tribunal</option>
                        <option value="secretario">Secretario</option>
                        <option value="estudiante">Estudiante</option>
                    </select>
                </div>

                <!-- Campos adicionales según rol -->
                <div v-if="rol === 'director'" class="mb-3">
                    <label class="form-label text-start w-100">Gestión</label>
                    <input type="text" v-model="gestion" class="form-control" placeholder="2023 - 2025" />
                </div>
                <div v-if="rol === 'tribunal'" class="mb-3">
                    <label class="form-label text-start w-100">Especialidad</label>
                    <select v-model="especialidad" class="form-select">
                        <option value="" disabled>Seleccione especialidad</option>
                        <option>Desarrollo de software</option>
                        <option>Telemática</option>
                        <option>Gestión empresarial</option>
                    </select>
                </div>
                <div v-if="rol === 'estudiante'" class="mb-3">
                    <label class="form-label text-start w-100">Tipo</label>
                    <select v-model="tipo" class="form-select">
                        <option value="" disabled>Seleccione tipo</option>
                        <option value="regular">Regular</option>
                        <option value="egresado">Egresado</option>
                    </select>
                </div>
                <div v-if="rol === 'secretario'" class="mb-3">
                    <label class="form-label text-start w-100">Año de entrada</label>
                    <input type="number" v-model="anioEntrada" class="form-control" placeholder="2020" />
                </div>

                <!-- Fecha -->
                <div class="mb-3">
                    <label class="form-label text-start w-100">Fecha de registro</label>
                    <input type="date" v-model="fechaRegistro" class="form-control" />
                </div>

                <!-- Botón guardar -->
                <div class="text-center mt-4">
                    <button class="btn btn-success px-4">Guardar usuario</button>
                </div>
            </div>
        </div>
    </section>
</template>
