<script setup>
import { ref, computed } from 'vue'
import { usuarios } from '@/data/usuarios.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const busqueda = ref('')

const usuariosFiltrados = computed(() => {
    const criterio = busqueda.value.trim().toLowerCase()
    if (!criterio) return usuarios

    return usuarios.filter(usuario =>
        [usuario.nombres, usuario.primer_apellido, usuario.segundo_apellido, usuario.rol]
            .some(campo => campo.toLowerCase().includes(criterio))
    )
})

// Función para obtener una clase de color para cada rol
const getRolClass = (rol) => {
    switch (rol.toLowerCase()) {
        case 'director': return 'text-bg-danger';
        case 'secretario': return 'text-bg-info';
        case 'tribunal': return 'text-bg-warning';
        case 'estudiante': return 'text-bg-success';
        default: return 'text-bg-secondary';
    }
}

// Navegar a la vista de añadir (depende del rol actual en la URL)
const irAAgregar = () => {
    if (router.currentRoute.value.path.includes('/director')) {
        router.push({ name: 'DUsuarioAdicionarView' });
    } else {
        router.push({ name: 'SUsuarioAdicionarView' });
    }
}

// Simulación de inhabilitar
const inhabilitarUsuario = (id) => {
    alert(`Inhabilitando usuario con ID: ${id}`);
}
</script>

<template>
    <section class="container-fluid mt-4">
        <!-- Encabezado de la página con TÍTULO CENTRADO -->
        <div class="text-center mb-4">
            <h2 class="text-dark-emphasis fw-bold mb-0">Gestión de Usuarios</h2>
        </div>

        <!-- Barra de Búsqueda y Botón Añadir -->
        <div class="d-flex justify-content-between align-items-center mb-4">
             <div class="input-group" style="max-width: 400px;">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" placeholder="Buscar por nombre, apellido o rol..." v-model="busqueda" />
            </div>
            <button @click="irAAgregar" class="btn btn-primary d-flex align-items-center">
                <i class="bi bi-person-plus-fill me-2"></i> Añadir Usuario
            </button>
        </div>

        <!-- Tabla de usuarios con estilo mejorado -->
        <div class="card shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-striped align-middle mb-0">
                        <thead class="table-dark">
                            <tr class="text-center">
                                <th>Nombre Completo</th>
                                <th>Rol</th>
                                <th>Correo Electrónico</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="usuario in usuariosFiltrados" :key="usuario.idUsuario">
                                <!-- **CORRECCIÓN AQUÍ**: Se centra el texto y se quita la negrita -->
                                <td class="text-center">
                                    {{ usuario.primer_apellido }} {{ usuario.segundo_apellido }}, {{ usuario.nombres }}
                                </td>
                                <td class="text-center">
                                    <span class="badge rounded-pill" :class="getRolClass(usuario.rol)">
                                        {{ usuario.rol.toUpperCase() }}
                                    </span>
                                </td>
                                <td class="text-center">{{ usuario.usuario }}</td>
                                <td class="text-center">
                                    <span class="badge" :class="usuario.estado ? 'text-bg-success' : 'text-bg-secondary'">
                                        {{ usuario.estado ? 'Activo' : 'Inactivo' }}
                                    </span>
                                </td>
                                <td class="text-center">
                                    <div class="btn-group" role="group">
                                        <router-link
                                            :to="{ name: router.currentRoute.value.path.includes('/director') ? 'DUsuarioModificarView' : 'SUsuarioModificarView', params: { id: usuario.idUsuario } }"
                                            class="btn btn-sm btn-outline-primary" title="Modificar">
                                            <i class="bi bi-pencil-fill"></i>
                                        </router-link>
                                        <button @click="inhabilitarUsuario(usuario.idUsuario)" class="btn btn-sm btn-outline-danger" title="Inhabilitar">
                                            <i class="bi bi-person-x-fill"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                             <tr v-if="usuariosFiltrados.length === 0">
                                <td colspan="5" class="text-center text-muted p-4">No se encontraron usuarios.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>