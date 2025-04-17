<script setup>
import { ref, computed } from 'vue'
import { temas } from '@/data/temas.js'

const busqueda = ref('')

const temasFiltrados = computed(() => {
	const criterio = busqueda.value.trim().toLowerCase()
	if (!criterio) return temas

	return temas.filter(t =>
		t.nombre.toLowerCase().includes(criterio) ||
		t.estado.toLowerCase().includes(criterio)
	)
})

// Opcional: mapa de clases por estado
const claseEstado = (estado) => {
	switch (estado) {
		case 'aprobado': return 'text-white bg-success'
		case 'reprobado': return 'text-white bg-danger'
		case 'pendiente': return 'text-dark bg-warning'
		case 'preliminar': return 'text-white bg-secondary'
		default: return ''
	}
}
</script>

<template>
	<section class="container mt-4">
		<!-- Título -->
		<h2 class="text-center fw-bold mb-4">Temas</h2>

		<!-- Búsqueda -->
		<div class="d-flex justify-content-between align-items-center mb-3">
			<input type="text" class="form-control me-2" placeholder="Buscar tema..." v-model="busqueda"
				style="max-width: 300px;" />
		</div>

		<!-- Tabla -->
		<div class="table-responsive">
			<table class="table table-bordered table-striped align-middle">
				<thead class="table-dark text-center">
					<tr>
						<th>Nombre del tema</th>
						<th>Estado</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="tema in temasFiltrados" :key="tema.idTema" class="text-center">
						<td>{{ tema.nombre }}</td>
						<td>
							<span :class="['badge', 'px-3', 'py-2', claseEstado(tema.estado)]">
								{{ tema.estado.toUpperCase() }}
							</span>
						</td>
						<td>
							<router-link :to="{ name: 'TTemaGestionView', params: { id: tema.idTema } }"
								class="btn btn-sm btn-info">
								Ver mas
							</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
