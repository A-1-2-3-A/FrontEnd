import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import router from '@/router' // Importamos el router para redirigir

// Se define la URL base de la API. En un proyecto real, esto vendría de un archivo .env
const API_URL = 'http://localhost:3000'

export const useAuthStore = defineStore('auth', () => {
    // --- STATE ---
    // Se inicializa el estado intentando cargar los datos desde localStorage
    const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)
    const token = ref(localStorage.getItem('token') || null)

    // --- GETTERS ---
    // Getter para saber si el usuario está autenticado
    const isAuthenticated = computed(() => !!token.value && !!usuario.value)
    // Getter para obtener el rol del usuario de forma segura
    const userRole = computed(() => usuario.value?.rol || null)
    // Getter para obtener el token para las peticiones a la API
    const authToken = computed(() => token.value)

    // --- ACTIONS ---

    /**
     * Función para iniciar sesión. Llama a la API, y si es exitoso,
     * guarda los datos del usuario y el token en el estado y en localStorage.
     */
    async function login(credenciales) {
        try {
            // Se realiza la petición POST a la API
            const response = await axios.post(`${API_URL}/usuarios/login`, {
                usuario: credenciales.usuario,
                clave: credenciales.clave
            })

            const userData = response.data.data
            const userToken = response.data.token

            // Si la petición es exitosa, actualizamos el estado
            usuario.value = userData
            token.value = userToken

            // Guardamos los datos en localStorage para persistir la sesión
            localStorage.setItem('usuario', JSON.stringify(userData))
            localStorage.setItem('token', userToken)

            // Redirigimos al panel correspondiente según el rol
            switch (userData.rol.toLowerCase()) {
                case 'director': router.push('/director'); break
                case 'tribunal': router.push('/tribunal'); break
                case 'secretario': router.push('/secretario'); break
                case 'estudiante': router.push('/estudiante'); break
                default: router.push('/'); // Fallback
            }

            return true // Indica que el login fue exitoso
        } catch (error) {
            console.error('Error en el inicio de sesión:', error.response?.data?.message || error.message)
            // Limpiamos cualquier dato residual en caso de error
            logout()
            return false // Indica que el login falló
        }
    }

    /**
     * Función para cerrar sesión. Limpia el estado y localStorage,
     * y redirige a la página de login.
     */
    function logout() {
        usuario.value = null
        token.value = null
        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
        router.push('/login')
    }

    return {
        // State
        usuario,
        token,
        // Getters
        isAuthenticated,
        userRole,
        authToken,
        // Actions
        login,
        logout
    }
})