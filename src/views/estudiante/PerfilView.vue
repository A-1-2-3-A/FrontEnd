<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth'; 
import { usuarios } from '@/data/usuarios.js'; 

const authStore = useAuthStore();
const usuario = ref(null);

const claveActual = ref('');
const claveNueva = ref('');
const repetirClaveNueva = ref('');

onMounted(() => {
    const usuarioLogueado = authStore.usuario;
    if (usuarioLogueado) {
        const detallesCompletos = usuarios.find(u => u.idUsuario === usuarioLogueado.id);
        usuario.value = { ...usuarioLogueado, ...detallesCompletos };
    }
});

function actualizarContrasena() {
    if (!claveActual.value || !claveNueva.value || !repetirClaveNueva.value) {
        alert("Todos los campos de contraseña son requeridos.");
        return;
    }
    if (claveNueva.value !== repetirClaveNueva.value) {
        alert("Las nuevas contraseñas no coinciden.");
        return;
    }
    alert("Llamando a la API para actualizar la contraseña...");
}
</script>

<template>
    <section class="container mt-4">
        <div v-if="usuario" class="w-100" style="max-width: 600px; margin: auto;">
            <!-- Recuadro Principal de Información -->
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white fw-bold text-center">
                    Información del Perfil
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label">Nombres</label>
                        <div class="form-control-plaintext-custom">{{ usuario.nombres }}</div>
                    </div>
                     <div class="mb-3">
                        <label class="form-label">Apellidos</label>
                        <div class="form-control-plaintext-custom">{{ usuario.primer_apellido }} {{ usuario.segundo_apellido }}</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <div class="form-control-plaintext-custom bg-light">{{ usuario.usuario }}</div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <div class="form-control-plaintext-custom text-capitalize">{{ usuario.rol }}</div>
                    </div>
                    <div v-if="usuario.rol === 'tribunal' || usuario.rol === 'director'" class="mb-3">
                        <label class="form-label">Especialidad</label>
                        <div class="form-control-plaintext-custom">{{ usuario.especialidad || 'No asignada' }}</div>
                    </div>
                     <div v-if="usuario.rol === 'estudiante'" class="mb-3">
                        <label class="form-label">Tipo de Estudiante</label>
                        <div class="form-control-plaintext-custom text-capitalize">{{ usuario.tipo || 'No asignado' }}</div>
                    </div>
                </div>
            </div>

            <!-- Recuadro para Actualizar Contraseña -->
            <form @submit.prevent="actualizarContrasena" class="card shadow-sm">
                <div class="card-header bg-secondary text-white fw-bold text-center">
                    Actualizar Contraseña
                </div>
                 <div class="card-body p-4">
                     <div class="mb-3">
                        <label for="claveActual" class="form-label">Contraseña Actual</label>
                        <input id="claveActual" type="password" v-model="claveActual" class="form-control"/>
                    </div>
                    <div class="mb-3">
                        <label for="claveNueva" class="form-label">Nueva Contraseña</label>
                        <input id="claveNueva" type="password" v-model="claveNueva" class="form-control"/>
                    </div>
                    <div class="mb-3">
                        <label for="repetirClaveNueva" class="form-label">Repetir Nueva Contraseña</label>
                        <input id="repetirClaveNueva" type="password" v-model="repetirClaveNueva" class="form-control" />
                    </div>
                     <div class="text-center mt-4">
                        <button type="submit" class="btn btn-primary px-5">Actualizar</button>
                    </div>
                 </div>
            </form>
        </div>
        <div v-else class="alert alert-warning">
            Cargando información del perfil...
        </div>
    </section>
</template>

<style scoped>
.form-control-plaintext-custom {
    padding: 0.5rem 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: .375rem;
    background-color: white;
    font-size: 1rem;
    font-weight: 400;
    color: #212529;
}
.form-label {
    margin-bottom: 0.5rem;
}
</style>