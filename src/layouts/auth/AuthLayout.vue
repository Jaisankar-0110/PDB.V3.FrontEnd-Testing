<template>
    <div class="auth">
        <div class="row g-0 min-vh-100">
            <div class="col-md-6">
                <div class=" overflow-hidden">
                    <img src="/image/auth-img_1.png" alt="Auth Image" class="auth-img_1" />
                </div>
            </div>
            <div class="col-md-6 p-md-5 p-2">
                <div class="text-end mb-2">
                    <img src="/image/auth-img_2.png" alt="Partner Logo" width="90" />
                </div>
                <div class="d-flex align-items-center justify-content-center">
                    <div class="card p-md-4 p-2">
                        <div class="card-body">
                            <div class="text-center mb-4">
                                <img src="/image/logo.png" alt="Logo" class="logo" />
                            </div>
                            <div>
                                <router-view />
                            </div>
                            <div class="mt-4 text-center">
                                <span class="text-dark fs13">&copy; 2025, Alice Blue Financial Services (P) Ltd, All rights reserved.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text-start mt-2">
                    <img src="/image/auth-img_2.png" alt="Partner Logo" width="40" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.logo {
    width: 100px;

}

.auth-img_1 {
    width: 100% !important;
    max-width: 730px !important;
}

.card {
    width: 100% !important;
    max-width: 450px !important;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px !important;
}
</style>
