<script setup>

</script>

<template>
    <div class="sidebar d-flex flex-column">
        <nav class="nav flex-column mt-3">
            <router-link :to="{ name: 'TPrincipalView' }"
                class="nav-link text-white d-flex align-items-center px-3 py-2">
                <i class="bi bi-house me-2"></i> Inicio
            </router-link>
            <router-link :to="{ name: 'TPerfilView' }" class="nav-link text-white d-flex align-items-center px-3 py-2">
                <i class="bi bi-people me-2"></i> Ver Perfil
            </router-link>
            <router-link :to="{ name: 'TTemaView' }" class="nav-link text-white d-flex align-items-center px-3 py-2">
                <i class="bi bi-book me-2"></i> Temas
            </router-link>
            <router-link :to="{ name: 'PublicView' }" class="nav-link text-white d-flex align-items-center px-3 py-2">
                <i class="bi bi-house me-2"></i> Salir
            </router-link>
        </nav>
    </div>
</template>

<style scoped>
.sidebar {
    width: 250px;
    background-color: #1a1c1e;
    color: white;
    display: flex;
    flex-direction: column;
    min-height: 100%;
}

.sidebar-header {
    background-color: #0d6efd;
    border-bottom: 1px solid #0a58ca;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.nav-link:hover {
    background-color: #0a58ca;
    color: white;
}

.nav-link i {
    font-size: 18px;
}
</style>