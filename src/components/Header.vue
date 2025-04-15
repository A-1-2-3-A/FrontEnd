<template>
    <header class="header d-flex align-items-center justify-content-between px-3">
        <div class="logo-container d-flex align-items-center">
            <router-link :to="{ name: 'PublicView' }" class="text-decoration-none text-white">
                <img src="../assets/image.png" alt="Logo" class="logo" />
            </router-link>
        </div>

        <div class="flex-grow-1 text-center">
            <h5 class="m-0 fw-bold">ING. SISTEMAS - ING. INFORMATICA</h5>
            <small>ADMINISTRACION DE PERFILES</small>
        </div>

        <div class="button-container">
            <router-link :to="{ name: 'LoginView' }" class="btn btn-outline-light me-2">
                <i class="bi bi-box-arrow-in-right"></i> Iniciar Sesión
            </router-link>
        </div>
    </header>
</template>

<style>
.header {
    width: 100%;
    background-color: #1a1c1e;
    color: white;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo-container {
    flex-shrink: 0; /* Evita que el logo se reduzca */
    display: flex;
    align-items: center; /* Alinea el logo verticalmente */
    margin-right: 10px; /* Espaciado entre el logo y el texto */
}

.logo {
    height: 50px; /* Ajusta la altura del logo */
    width: auto; /* Mantiene la proporción del logo */
    object-fit: contain; /* Asegura que el logo no se deforme */
}

.flex-grow-1 {
    flex-grow: 1; /* Permite que el texto ocupe el espacio central */
    text-align: center;
}

.button-container {
    flex-shrink: 0; /* Evita que el botón se reduzca */
}
</style>