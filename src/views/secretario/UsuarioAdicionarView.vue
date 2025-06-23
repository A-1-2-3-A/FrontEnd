<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '@/api/axios.js';
import { useModalStore } from '@/stores/modal.js';

const router = useRouter();
const modalStore = useModalStore();

const nuevoUsuario = ref({
    nombres: '',
    apellido_primero: '',
    apellido_segundo: '',
    usuario: '',
    clave: '',
    fecha_nacimiento: '',
    rol: '',
    tipo_estudiante: null,
    especialidades: []
});
const repetirClave = ref('');
const isLoading = ref(false);
const especialidadesDisponibles = ref([]);

// Cargar las especialidades desde la API al montar el componente.
async function fetchEspecialidades() {
    try {
        const response = await apiClient.get('/especialidades');
        especialidadesDisponibles.value = response.data.data;
    } catch (error) {
        console.error('Error al obtener las especialidades:', error);
        modalStore.showModal({
            title: 'Error de Red',
            message: 'No se pudieron cargar las especialidades disponibles.',
            type: 'error'
        });
    }
}
onMounted(fetchEspecialidades);

// Función para manejar el envío del formulario.
async function agregarUsuario() {
    if (nuevoUsuario.value.clave !== repetirClave.value) {
        modalStore.showModal({ title: 'Error de Validación', message: 'Las contraseñas no coinciden.', type: 'error' });
        return;
    }
    if (!nuevoUsuario.value.rol) {
        modalStore.showModal({ title: 'Error de Validación', message: 'Debe seleccionar un rol para el usuario.', type: 'error' });
        return;
    }

    isLoading.value = true;
    try {
        await apiClient.post('/usuarios', nuevoUsuario.value);
        modalStore.showModal({
            title: 'Éxito',
            message: 'Usuario agregado correctamente.',
            type: 'success'
        });

        // Apunta a la vista de usuarios del Secretario.
        router.push({ name: 'SUsuarioView' });

    } catch (error) {
        const mensajeError = error.response?.data?.message || 'Ocurrió un error al crear el usuario.';
        modalStore.showModal({
            title: 'Error de Creación',
            message: mensajeError,
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <section class="container mt-4">
        <form @submit.prevent="agregarUsuario" class="card shadow-sm w-100" style="max-width: 600px; margin: auto;">
            <div class="card-header bg-primary text-white fw-bold text-center">
                Agregar Nuevo Usuario
            </div>
            <div class="card-body p-4">
                <div class="mb-3">
                    <label for="nombres" class="form-label">Nombres</label>
                    <input id="nombres" type="text" v-model="nuevoUsuario.nombres" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="primerApellido" class="form-label">Primer Apellido</label>
                    <input id="primerApellido" type="text" v-model="nuevoUsuario.apellido_primero" class="form-control"
                        required />
                </div>
                <div class="mb-3">
                    <label for="segundoApellido" class="form-label">Segundo Apellido</label>
                    <input id="segundoApellido" type="text" v-model="nuevoUsuario.apellido_segundo"
                        class="form-control" />
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label">Correo Electrónico</label>
                    <input id="email" type="email" v-model="nuevoUsuario.usuario" class="form-control"
                        placeholder="usuario@sistemas.edu.bo" required />
                </div>
                <div class="mb-3">
                    <label for="clave" class="form-label">Contraseña</label>
                    <input id="clave" type="password" v-model="nuevoUsuario.clave" class="form-control" required />
                </div>
                <div class="mb-3">
                    <label for="repetirClave" class="form-label">Repetir Contraseña</label>
                    <input id="repetirClave" type="password" v-model="repetirClave" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
                    <input id="fechaNacimiento" type="date" v-model="nuevoUsuario.fecha_nacimiento"
                        class="form-control" />
                </div>

                <div class="mb-3">
                    <label for="rol" class="form-label">Rol</label>
                    <select id="rol" v-model="nuevoUsuario.rol" class="form-select" required>
                        <option value="" disabled>Seleccione un rol</option>
                        <option value="Tribunal">Tribunal</option>
                        <option value="Secretario">Secretario</option>
                        <option value="Estudiante">Estudiante</option>
                    </select>
                </div>

                <div v-if="nuevoUsuario.rol === 'Tribunal' || nuevoUsuario.rol === 'Director'" class="mb-3">
                    <label class="form-label">Especialidades</label>
                    <div class="border rounded p-2 bg-light">
                        <div v-for="esp in especialidadesDisponibles" :key="esp.id" class="form-check">
                            <input class="form-check-input" type="checkbox" :value="esp.id"
                                v-model="nuevoUsuario.especialidades" :id="`esp-${esp.id}`">
                            <label class="form-check-label" :for="`esp-${esp.id}`">{{ esp.nombre_especialidad }}</label>
                        </div>
                        <div v-if="!especialidadesDisponibles.length" class="text-muted small">
                            Cargando especialidades...
                        </div>
                    </div>
                </div>
                <div v-if="nuevoUsuario.rol === 'Estudiante'" class="mb-3">
                    <label class="form-label">Tipo de Estudiante</label>
                    <select v-model="nuevoUsuario.tipo_estudiante" class="form-select" required>
                        <option value="" disabled>Seleccione tipo</option>
                        <option value="REGULAR">Regular</option>
                        <option value="EGRESADO">Egresado</option>
                    </select>
                </div>

                <div class="text-center mt-4">
                    <button type="submit" class="btn btn-success px-5" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        <span v-else>Guardar Usuario</span>
                    </button>
                </div>
            </div>
        </form>
    </section>
</template>