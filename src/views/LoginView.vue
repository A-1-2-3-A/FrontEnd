<template>
    <div class="login-container d-flex justify-content-center align-items-center">
        <div class="login-card card p-4 shadow">
            <h5 class="text-center mb-4 fw-bold text-uppercase">Iniciar Sesión</h5>

            <form>
                <div class="mb-3">
                    <label for="usuario" class="form-label fw-semibold">Usuario</label>
                    <input type="text" class="form-control form-control-lg" id="usuario"
                        placeholder="Ingrese su usuario" />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label fw-semibold">Contraseña</label>
                    <input type="password" class="form-control form-control-lg" id="password"
                        placeholder="Ingrese su contraseña" />
                </div>

                <button type="submit" class="btn btn-primary btn-lg w-100 mt-3">Ingresar</button>
            </form>
        </div>
    </div>
</template>

<style>
.login-container {
    flex: 1;
    padding: 20px;
}

.login-card {
    background-color: #1a1c1e;
    color: white;
    border-radius: 10px;
    min-width: 350px;
    max-width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.login-card .form-control {
    background-color: #2c2f33;
    color: white;
    border: 1px solid #444;
}

.login-card .form-control:focus {
    background-color: #2c2f33;
    color: white;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.login-card .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.login-card .btn-primary:hover {
    background-color: #0056b3;
    border-color: #004085;
}
</style>
