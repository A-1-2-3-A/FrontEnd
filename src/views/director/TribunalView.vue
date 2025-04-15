<script setup>
import { ref, computed } from 'vue'
import { usuarios } from '@/data/usuarios.js'

const busqueda = ref('')

const tribunales = usuarios.filter(usuario => usuario.rol === 'tribunal')

const tribunalesFiltrados = computed(() => {
	const criterio = busqueda.value.trim().toLowerCase()
	if (!criterio) return tribunales

	return tribunales.filter(tribunal =>
		[tribunal.nombres, tribunal.primer_apellido, tribunal.segundo_apellido, tribunal.especialidad]
			.some(campo => campo.toLowerCase().includes(criterio))
	)
})
</script>

<template>
	<section class="container mt-4">
		<!-- Título -->
		<h2 class="text-center fw-bold mb-4">Tribunales</h2>

		<!-- Fila de búsqueda y botón -->
		<div class="d-flex justify-content-between align-items-center mb-3">
			<input type="text" class="form-control me-2" placeholder="Buscar tribunal..." v-model="busqueda"
				style="max-width: 300px;" />
			<router-link :to="{ name: 'DDesTribunalView' }" class="btn btn-primary">
				Designar tribunal
			</router-link>
		</div>

		<!-- Tabla de tribunales -->
		<div class="table-responsive">
			<table class="table table-bordered table-striped align-middle">
				<thead class="table-dark text-center">
					<tr>
						<th>Primer Apellido</th>
						<th>Segundo Apellido</th>
						<th>Nombres</th>
						<th>Especialidad</th>
						<th>Perfiles Asignados</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="tribunal in tribunalesFiltrados" :key="tribunal.idUsuario" class="text-center">
						<td>{{ tribunal.primer_apellido }}</td>
						<td>{{ tribunal.segundo_apellido }}</td>
						<td>{{ tribunal.nombres }}</td>
						<td>{{ tribunal.especialidad }}</td>
						<td>{{ tribunal.perfiles || 0 }}</td>
						<td>
							<router-link :to="{ name: 'DTribunalDetalleView', params: { id: tribunal.idUsuario } }"
								class="btn btn-sm btn-info">
								Ver detalle
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>