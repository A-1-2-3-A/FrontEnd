<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import BLEstudiante from '@/components/BLEstudiante.vue';
</script>

<template>
    <div class="d-flex flex-column min-vh-100 layout-wrapper">
        <Header />

        <div class="d-flex flex-grow-1 w-100">
            <aside class="sidebar bg-dark text-white">
                <BLEstudiante />
            </aside>

            <main class="flex-grow-1 p-4 bg-light">
                <RouterView />
            </main>
        </div>

        <Footer />
    </div>
</template>

<style scoped>
.layout-wrapper {
    width: 100%;
    overflow-x: hidden;
}

.sidebar {
    width: 250px;
    background-color: #1a1c1e;
    color: white;
}
</style>