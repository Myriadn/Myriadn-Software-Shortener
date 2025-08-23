package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/Myriadn/Myriadn-Software-Shortener/internal/database"
)

type Server struct {
	port int
	db   *database.Store
}

// Start server
func NewServer(db *database.Store) *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	if port == 0 {
		port = 8080
	}

	serverState := &Server{
		port: port,
		db:   db,
	}

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", serverState.port),
		Handler:      serverState.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}

// func (s *Server) Start() error {
// 	router := s.RegisterRoutes()

// 	server := &http.Server{
// 		Addr:    ":" + s.port,
// 		Handler: router,
// 	}

// 	fmt.Printf("Is running on port %s\n", s.port)
// 	return server.ListenAndServe()
// }
