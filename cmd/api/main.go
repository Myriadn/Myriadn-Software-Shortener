package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Myriadn/Myriadn-Software-Shortener/internal/database"
	"github.com/Myriadn/Myriadn-Software-Shortener/internal/server"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println(".env is Missing, continue to default configuration")
	}

	appEnv := os.Getenv("APP_ENV")
	if appEnv == "" {
		appEnv = "local"
	}

	var logger *slog.Logger
	if appEnv == "local" {
		// Logger untuk development: mudah dibaca manusia
		logger = slog.New(slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelDebug}))
		logger.Info("Running in local environment with human-readable logs")
	} else {
		// Logger untuk produksi: format JSON
		logger = slog.New(slog.NewJSONHandler(os.Stdout, nil))
		logger.Info("Running in production environment with JSON logs")
	}
	slog.SetDefault(logger)

	dbPath := os.Getenv("BLUEPRINT_DB_URL")
	if dbPath == "" {
		dbPath = "m_shortener_url.db"
	}

	db, err := database.NewStore(dbPath)
	if err != nil {
		logger.Error("Failed to init database :(", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	// Init Schema
	schema, err := os.ReadFile("schema.sql")
	if err != nil {
		logger.Error("Failed to read schema.sql files :(", "error", err)
		os.Exit(1)
	}
	if err := db.Init(string(schema)); err != nil {
		logger.Error("Failed to apply database schema :(", "error", err)
		os.Exit(1)
	}
	logger.Info("Database init and schema applied :)")

	// Init server
	apiServer := server.NewServer(db)

	// Shutdown
	done := make(chan bool, 1)

	go func() {
		ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
		defer stop()

		<-ctx.Done()

		slog.Info("Shutting down gracefully, press Ctrl+C again to force")

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := apiServer.Shutdown(ctx); err != nil {
			log.Printf("Server forced to shutdown with error: %v", err)
		}

		done <- true
	}()

	slog.Info("Server starting", "address", apiServer.Addr)
	if err := apiServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("http server error: %s", err))
	}

	<-done
	slog.Info("Server exited gracefully")
}
