<template>
	<section class="container mt-4 d-flex flex-column align-items-center">

		<!-- Recuadro: Información del perfil - Estudiante -->
		<div class="card shadow mb-4 w-100" style="max-width: 600px;">
			<div class="card-header bg-primary text-white fw-bold">
				Información del perfil
			</div>
			<div class="card-body">
				<div class="mb-3">
					<label class="form-label text-start w-100">Nombres</label>
					<input type="text" class="form-control" value="Ana Sofía" disabled>
				</div>
				<div class="mb-3">
					<label class="form-label text-start w-100">Apellidos</label>
					<input type="text" class="form-control" value="Gutiérrez Molina" disabled>
				</div>
				<div class="mb-3">
					<label class="form-label text-start w-100">Rol</label>
					<input type="text" class="form-control" value="Estudiante" disabled>
				</div>
				<div class="mb-3">
					<label class="form-label text-start w-100">Tipo</label>
					<input type="text" class="form-control" value="Regular" disabled>
				</div>
				<div class="mb-3">
					<label class="form-label text-start w-100">Fecha de registro</label>
					<input type="text" class="form-control" value="12 de marzo de 2024" disabled>
				</div>
			</div>
		</div>

		<!-- Recuadro: Actualizar contraseña -->
		<div class="card shadow mb-4 w-100" style="max-width: 600px;">
			<div class="card-header bg-secondary text-white fw-bold">
				Actualizar contraseña
			</div>
			<div class="card-body">
				<form>
					<div class="mb-3">
						<label for="actual" class="form-label text-start w-100">Contraseña actual</label>
						<input type="password" id="actual" class="form-control" />
					</div>
					<div class="mb-3">
						<label for="nueva" class="form-label text-start w-100">Nueva contraseña</label>
						<input type="password" id="nueva" class="form-control" />
					</div>
					<div class="mb-3">
						<label for="repetir" class="form-label text-start w-100">Repetir contraseña</label>
						<input type="password" id="repetir" class="form-control" />
					</div>
					<button type="submit" class="btn btn-primary w-100">Actualizar</button>
				</form>
			</div>
		</div>

	</section>
</template>
