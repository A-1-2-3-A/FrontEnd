<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
    <div class="d-flex flex-column min-vh-100">
        <Header state="publico" />
        <main class="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <RouterView />
        </main>
        <Footer />
    </div>
</template>
