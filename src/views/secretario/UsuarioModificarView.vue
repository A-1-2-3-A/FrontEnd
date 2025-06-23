<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import apiClient from '@/api/axios.js';
import { useModalStore } from '@/stores/modal.js';

const route = useRoute();
const router = useRouter();
const modalStore = useModalStore();
const idUsuario = route.params.id;

const usuario = ref(null);
const isLoading = ref(true);
const especialidadesDisponibles = ref([]);

// Cargar los datos iniciales del usuario y de las especialidades.
async function fetchData() {
    isLoading.value = true;
    try {
        const [resUsuario, resEspecialidades] = await Promise.all([
            apiClient.get(`/usuarios/${idUsuario}`),
            apiClient.get('/especialidades')
        ]);

        usuario.value = resUsuario.data.data;
        especialidadesDisponibles.value = resEspecialidades.data.data;

        if (usuario.value && !Array.isArray(usuario.value.especialidades)) {
            usuario.value.especialidades = [];
        }

    } catch (error) {
        console.error("Error al obtener los datos para modificar:", error);
        modalStore.showModal({
            title: 'Error',
            message: 'No se pudieron cargar los datos del usuario.',
            type: 'error'
        });
        usuario.value = null;
    } finally {
        isLoading.value = false;
    }
}

onMounted(fetchData);

// Lógica para guardar los cambios en la API.
async function guardarCambios() {
    if (!usuario.value) return;
    isLoading.value = true;

    try {
        await apiClient.put(`/usuarios/${idUsuario}`, usuario.value);

        modalStore.showModal({
            title: 'Éxito',
            message: 'Usuario actualizado correctamente.',
            type: 'success'
        });

        // REDIRECCIÓN CORREGIDA: Apunta a la vista de usuarios del Secretario.
        router.push({ name: 'SUsuarioView' });

    } catch (error) {
        const mensajeError = error.response?.data?.message || 'Ocurrió un error al actualizar el usuario.';
        modalStore.showModal({
            title: 'Error de Actualización',
            message: mensajeError,
            type: 'error'
        });
    } finally {
        isLoading.value = false;
    }
}


// Propiedad computada para deshabilitar el cambio de rol.
const puedeCambiarRol = computed(() => {
    if (!usuario.value) return false;
    return ['Director', 'Tribunal'].includes(usuario.value.rol);
});
</script>

<template>
    <section class="container mt-4">
        <div v-if="isLoading" class="text-center p-5">
            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando datos del usuario...</p>
        </div>

        <form v-else-if="usuario" @submit.prevent="guardarCambios" class="w-100"
            style="max-width: 600px; margin: auto;">
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white fw-bold text-center">
                    Modificar Usuario: {{ usuario.nombres }} {{ usuario.apellido_primero }}
                </div>
                <div class="card-body p-4">
                    <div class="mb-3">
                        <label class="form-label">Nombres</label>
                        <input type="text" v-model="usuario.nombres" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Primer Apellido</label>
                        <input type="text" v-model="usuario.apellido_primero" class="form-control" required />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Segundo Apellido</label>
                        <input type="text" v-model="usuario.apellido_segundo" class="form-control" />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Correo Electrónico</label>
                        <input type="email" v-model="usuario.usuario" class="form-control" disabled readonly />
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <select v-model="usuario.rol" class="form-select" :disabled="!puedeCambiarRol">
                            <option value="Director">Director</option>
                            <option value="Tribunal">Tribunal</option>
                            <option value="Secretario">Secretario</option>
                            <option value="Estudiante">Estudiante</option>
                        </select>
                        <small v-if="!puedeCambiarRol" class="form-text text-muted">El rol no se puede
                            modificar.</small>
                    </div>

                    <div v-if="usuario.rol === 'Director' || usuario.rol === 'Tribunal'" class="mb-3">
                        <label class="form-label">Especialidades</label>
                        <div class="border rounded p-2 bg-light">
                            <div v-for="esp in especialidadesDisponibles" :key="esp.id" class="form-check">
                                <input class="form-check-input" type="checkbox" :value="esp.id"
                                    v-model="usuario.especialidades" :id="`esp-${esp.id}`">
                                <label class="form-check-label" :for="`esp-${esp.id}`">{{ esp.nombre_especialidad
                                    }}</label>
                            </div>
                        </div>
                    </div>
                    <div v-if="usuario.rol === 'Estudiante'" class="mb-3">
                        <label class="form-label">Tipo de Estudiante</label>
                        <select v-model="usuario.tipo_estudiante" class="form-select" required>
                            <option value="REGULAR">Regular</option>
                            <option value="EGRESADO">Egresado</option>
                        </select>
                    </div>
                </div>
                <div class="card-footer text-center bg-light">
                    <button type="submit" class="btn btn-success px-5" :disabled="isLoading">
                        <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                            aria-hidden="true"></span>
                        <span v-else>Guardar Cambios</span>
                    </button>
                </div>
            </div>
        </form>
        <div v-else-if="!isLoading" class="alert alert-danger text-center">
            No se pudo encontrar al usuario para modificar.
        </div>
    </section>
</template>