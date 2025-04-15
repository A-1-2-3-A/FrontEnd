import { createRouter, createWebHistory } from 'vue-router'
import PublicoLayout from '@/layouts/PublicoLayout.vue'
import DirectorLayout from '@/layouts/DirectorLayout.vue'
import TribunalLayout from '@/layouts/TribunalLayout.vue'
import SecretarioLayout from '@/layouts/SecretarioLayout.vue'
import EstudianteLayout from '@/layouts/EstudianteLayout.vue'

import PublicView from '@/views/PublicView.vue'
import LoginView from '@/views/LoginView.vue'

import DPrincipalView from '@/views/director/PrincipalView.vue'
import DPerfilView from '@/views/director/PerfilView.vue'
import DUsuarioView from '@/views/director/UsuarioView.vue'
import DUsuarioAdicionarView from '@/views/director/UsuarioAdicionarView.vue'
import DUsuarioModificarView from '@/views/director/UsuarioModificarView.vue'
import DTribunalView from '@/views/director/TribunalView.vue'
import DDesTribunalView from '@/views/director/DesTribunalView.vue'
import DTribunalDetalleView from '@/views/director/TribunalDetalleView.vue'
import DTemaView from '@/views/director/TemaView.vue'
import DTemaDetalleView from '@/views/director/TemaDetalleView.vue'

import TPrincipalView from '@/views/tribunal/PrincipalView.vue'
import TPerfilView from '@/views/tribunal/PerfilView.vue'
import TTemaView from '@/views/tribunal/TemaView.vue'

import SPrincipalView from '@/views/secretario/PrincipalView.vue'
import SPerfilView from '@/views/secretario/PerfilView.vue'
import SUsuarioView from '@/views/secretario/UsuarioView.vue'
import STemaView from '@/views/secretario/TemaView.vue'

import EPrincipalView from '@/views/estudiante/PrincipalView.vue'
import EPerfilView from '@/views/estudiante/PerfilView.vue'
import ETemaView from '@/views/estudiante/TemaView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: PublicoLayout,
            children: [
                {
                    path: '',
                    name: 'PublicView',
                    component: PublicView,
                },
                {
                    path: 'login',
                    name: 'LoginView',
                    component: LoginView,
                },
            ],
        },
        {
            path: '/director',
            component: DirectorLayout,
            children: [
                {
                    path: '',
                    name: 'DPrincipalView',
                    component: DPrincipalView,
                },
                {
                    path: 'perfil',
                    name: 'DPerfilView',
                    component: DPerfilView,
                },
                {
                    path: 'usuario',
                    name: 'DUsuarioView',
                    component: DUsuarioView,
                },
                {
                    path: 'usuario/adicionar',
                    name: 'DUsuarioAdicionarView',
                    component: DUsuarioAdicionarView,
                },
                {
                    path: 'usuario/:id/modificar',
                    name: 'DUsuarioModificarView',
                    component: DUsuarioModificarView,
                    props: true,
                },
                {
                    path: 'tribunal',
                    name: 'DTribunalView',
                    component: DTribunalView,
                },
                {
                    path: 'tribunal/designar',
                    name: 'DDesTribunalView',
                    component: DDesTribunalView,
                },
                {
                    path: 'tribunal/:id/detalle',
                    name: 'DTribunalDetalleView',
                    component: DTribunalDetalleView,
                    props: true,
                }, 
                {
                    path: 'tema',
                    name: 'DTemaView',
                    component: DTemaView,
                },
                {
                    path: 'tema/:id/detalle',
                    name: 'DTemaDetalleView',
                    component: DTemaDetalleView,
                },
            ],
        },
        {
            path: '/tribunal',
            component: TribunalLayout,
            children: [
                {
                    path: '',
                    name: 'TPrincipalView',
                    component: TPrincipalView,
                },
                {
                    path: 'perfil',
                    name: 'TPerfilView',
                    component: TPerfilView,
                },
                {
                    path: 'tema',
                    name: 'TTemaView',
                    component: TTemaView,
                },
            ],
        },
        {
            path: '/secretario',
            component: SecretarioLayout,
            children: [
                {
                    path: '',
                    name: 'SPrincipalView',
                    component: SPrincipalView,
                },
                {
                    path: 'perfil',
                    name: 'SPerfilView',
                    component: SPerfilView,
                },
                {
                    path: 'usuario',
                    name: 'SUsuarioView',
                    component: SUsuarioView,
                },
                {
                    path: 'tema',
                    name: 'STemaView',
                    component: STemaView,
                },
            ],
        },
        {
            path: '/estudiante',
            component: EstudianteLayout,
            children: [
                {
                    path: '',
                    name: 'EPrincipalView',
                    component: EPrincipalView,
                },
                {
                    path: 'perfil',
                    name: 'EPerfilView',
                    component: EPerfilView,
                },
                {
                    path: 'tema',
                    name: 'ETemaView',
                    component: ETemaView,
                },
            ],
        },
    ],
})

export default router
