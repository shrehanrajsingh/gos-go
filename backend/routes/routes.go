package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/shrehanrajsingh/godashboard/controllers"
	"github.com/shrehanrajsingh/godashboard/middleware"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/signup", controllers.SignUp)
	r.POST("/signin", controllers.SignIn)

	auth := r.Group("/")
	auth.Use(middleware.AuthMiddleware())
	auth.GET("/me", controllers.GetProfile)
	auth.PUT("/me", controllers.UpdateProfile)
}
