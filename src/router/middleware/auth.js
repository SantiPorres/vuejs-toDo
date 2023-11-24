export default function authMiddleware(router, to, from, next) {
    const store = router.app.store;  // Accede al store a través de la instancia de la aplicación

    const isAuthenticated = store.state.isAuthenticated;
    
    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
      // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir a la página de inicio de sesión
      next('/');
    } else {
      // Si está autenticado o la ruta no requiere autenticación, continuar con la navegación
      next();
    }
  }