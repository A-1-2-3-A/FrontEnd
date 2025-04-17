<script setup>
import { ref, computed } from 'vue'
import { usuarios } from '@/data/usuarios.js'

const busqueda = ref('')

const usuariosFiltrados = computed(() => {
	const criterio = busqueda.value.trim().toLowerCase()
	if (!criterio) return usuarios

	return usuarios.filter(usuario =>
		[usuario.nombres, usuario.primer_apellido, usuario.segundo_apellido, usuario.rol]
			.some(campo => campo.toLowerCase().includes(criterio))
	)
})
</script>

<template>
	<section class="container mt-4">
		<!-- Título -->
		<h2 class="text-center fw-bold mb-4">Usuarios</h2>

		<!-- Fila de búsqueda y botón -->
		<div class="d-flex justify-content-between align-items-center mb-3">
			<input type="text" class="form-control me-2" placeholder="Buscar usuario..." v-model="busqueda"
				style="max-width: 300px;" />
			<router-link :to="{ name: 'SUsuarioAdicionarView' }" class="btn btn-primary">
				Añadir usuario
			</router-link>
		</div>

		<!-- Tabla de usuarios -->
		<div class="table-responsive">
			<table class="table table-bordered table-striped align-middle">
				<thead class="table-dark text-center">
					<tr>
						<th>Primer Apellido</th>
						<th>Segundo Apellido</th>
						<th>Nombres</th>
						<th>Rol</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="usuario in usuariosFiltrados" :key="usuario.idUsuario" class="text-center">
						<td>{{ usuario.primer_apellido }}</td>
						<td>{{ usuario.segundo_apellido }}</td>
						<td>{{ usuario.nombres }}</td>
						<td>{{ usuario.rol.toUpperCase() }}</td>
						<td>
							<div class="d-flex justify-content-center gap-2">
								<router-link :to="{ name: 'SUsuarioModificarView', params: { id: usuario.idUsuario } }"
									class="btn btn-sm btn-primary">
									Modificar
								</router-link>
								<button class="btn btn-sm btn-secondary">Inhabilitar</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>