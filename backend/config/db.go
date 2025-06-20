package config

import (
	"fmt"
	"log"
	"os"

	"github.com/shrehanrajsingh/godashboard/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	cmd_args := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=5432 sslmode=disable", os.Getenv("DB_HOST"), os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_NAME"))

	db, err := gorm.Open(postgres.Open(cmd_args), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to DB: ", err)
	}

	err = db.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatal("DB Migration Failed: ", err)
	}

	DB = db
}
