<script setup>
import { ref, computed } from 'vue'
import { temas } from '@/data/temas.js'
import { usuarios } from '@/data/usuarios.js'

// Estados para selección
const temaSeleccionado = ref(null)
const tribunalSeleccionados = ref([])

// Filtrar tribunales disponibles
const tribunales = computed(() =>
	usuarios.filter(u => u.rol === 'tribunal')
)

// Buscar por texto en tema
const textoTema = ref('')
const temasFiltrados = computed(() => {
	const criterio = textoTema.value.trim().toLowerCase()
	if (!criterio) return temas
	return temas.filter(t => t.nombre.toLowerCase().includes(criterio))
})

// Buscar por texto en tribunales
const textoTribunal = ref('')
const tribunalesFiltrados = computed(() => {
	const criterio = textoTribunal.value.trim().toLowerCase()
	return tribunales.value.filter(t =>
		`${t.nombres} ${t.primer_apellido} ${t.segundo_apellido}`
			.toLowerCase()
			.includes(criterio)
	)
})

// Lógica de selección
function toggleTribunal(id) {
	if (tribunalSeleccionados.value.includes(id)) {
		tribunalSeleccionados.value = tribunalSeleccionados.value.filter(t => t !== id)
	} else if (tribunalSeleccionados.value.length < 3) {
		tribunalSeleccionados.value.push(id)
	}
}
</script>

<template>
	<section class="container mt-4">
		<h2 class="fw-bold mb-4 text-center">Designación de Tribunales</h2>

		<!-- Selección de tema -->
		<div class="mb-4">
			<select class="form-select" v-model="temaSeleccionado">
				<option :value="null" disabled>Seleccione un tema</option>
				<option v-for="t in temasFiltrados" :key="t.idTema" :value="t.idTema">
					{{ t.nombre }}
				</option>
			</select>
		</div>

		<!-- Selección de tribunales -->
		<div class="mb-4">
			<label class="form-label fw-semibold">Seleccione 3 tribunales:</label>
			<input type="text" v-model="textoTribunal" placeholder="Buscar tribunal..." class="form-control mb-2" />
			<div class="list-group">
				<button v-for="t in tribunalesFiltrados" :key="t.idUsuario"
					class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
					:class="{ active: tribunalSeleccionados.includes(t.idUsuario) }"
					@click="toggleTribunal(t.idUsuario)">
					{{ t.primer_apellido }} {{ t.segundo_apellido }}, {{ t.nombres }}
					<span v-if="tribunalSeleccionados.includes(t.idUsuario)" class="badge bg-success">✔</span>
				</button>
			</div>
			<small class="text-muted mt-1 d-block">Seleccionados: {{ tribunalSeleccionados.length }} / 3</small>
		</div>

		<!-- Resumen de selección -->
		<div v-if="temaSeleccionado && tribunalSeleccionados.length === 3" class="alert alert-success">
			Tema seleccionado: <strong>{{temas.find(t => t.idTema === temaSeleccionado)?.nombre}}</strong><br />
			Tribunales asignados:
			<ul class="mb-0">
				<li v-for="id in tribunalSeleccionados" :key="id">
					{{usuarios.find(u => u.idUsuario === id)?.primer_apellido}}
					{{usuarios.find(u => u.idUsuario === id)?.segundo_apellido}},
					{{usuarios.find(u => u.idUsuario === id)?.nombres}}
				</li>
			</ul>
		</div>

		<!-- Botón Designar -->
		<div v-if="temaSeleccionado && tribunalSeleccionados.length === 3" class="text-center mt-4">
			<button class="btn btn-primary px-4">Designar</button>
		</div>
	</section>
</template>
