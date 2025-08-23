package server

import (
	"net/http"
	"strings"
)

func (s *Server) RegisterRoutes() http.Handler {
	mux := http.NewServeMux()

	// API Routes
	mux.HandleFunc("/api/links", s.handleURLAPI)  // POST
	mux.HandleFunc("/api/links/", s.handleURLAPI) // GET, PUT, DELETE

	// catching
	mux.HandleFunc("/", s.handleRedirect)

	return s.corsMiddleware(mux)
}

func (s *Server) handleURLAPI(w http.ResponseWriter, r *http.Request) {
	// POST /api/links
	if r.URL.Path == "/api/links" && r.Method == http.MethodPost {
		s.handleCreateURL(w, r)
		return
	}

	// GET, PUT, DELETE /api/links/{url}
	if strings.HasPrefix(r.URL.Path, "/api/links/") {
		switch r.Method {
		case http.MethodGet:
			s.handleGetURL(w, r)
		case http.MethodPut:
			s.handleUpdateURL(w, r)
		case http.MethodDelete:
			s.handleDeleteURL(w, r)
		default:
			// this not allowed
			http.Error(w, "Why? this not allowed sorry", http.StatusMethodNotAllowed)
		}

		return
	}

	// if not related
	http.NotFound(w, r)
}

// MiddleWare
func (s *Server) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Authorization, Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}
