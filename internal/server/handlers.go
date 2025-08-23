package server

import (
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"strings"

	"github.com/Myriadn/Myriadn-Software-Shortener/internal/database"
	"github.com/Myriadn/Myriadn-Software-Shortener/internal/shortener"
)

// --- Req & Res Structs --- //
type CreateURLRequest struct {
	URL        string `json:"url"`
	CustomCode string `json:"custom_code,omitempty"`
}

type UpdateURLRequest struct {
	URL string `json:"url"`
}

type CreateURLResponse struct {
	ShortURL string `json:"short_url"`
}

// --- HELPERS --- //
func (s *Server) respondJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

func (s *Server) respondError(w http.ResponseWriter, code int, message string) {
	s.respondJSON(w, code, map[string]string{"error": message})
}

// --- HANDLERS --- //

// GET /{shortURL}
func (s *Server) handleRedirect(w http.ResponseWriter, r *http.Request) {
	shortURL := strings.TrimPrefix(r.URL.Path, "/")
	if shortURL == "" {
		http.NotFound(w, r)
		return
	}

	link, err := s.db.GetLinkByShortCode(shortURL)
	if err != nil {
		slog.Warn("Not found for redirect :/", "code", shortURL, "error", err)
		http.NotFound(w, r)
		return
	}

	http.Redirect(w, r, link.OriginalURL, http.StatusMovedPermanently)
}

// POST /api/links
func (s *Server) handleCreateURL(w http.ResponseWriter, r *http.Request) {
	var req CreateURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.respondError(w, http.StatusBadRequest, "Invalid request body :(")
		return
	}

	if _, err := url.ParseRequestURI(req.URL); err != nil {
		s.respondError(w, http.StatusBadRequest, "Invalid URL format :/")
		return
	}

	code := req.CustomCode
	if code == "" {
		var err error
		code, err = shortener.GenerateShortURL()
		if err != nil {
			slog.Error("Can't generate short url :(", "error", err)
			s.respondError(w, http.StatusInternalServerError, "Can't generate short url :(")
			return
		}
	}

	newLink := &database.Link{ShortURL: code, OriginalURL: req.URL}
	if _, err := s.db.SaveLink(newLink); err != nil {
		if errors.Is(err, database.ErrShortCodeExists) {
			s.respondError(w, http.StatusConflict, "It's already had it :/")
			return
		}
		slog.Error("Failed to save lik to database :(", "error", err)
		s.respondError(w, http.StatusInternalServerError, "Can't save link")
		return
	}

	scheme := "http"
	if r.TLS != nil { // Cek jika koneksi adalah HTTPS
		scheme = "https"
	}
	fullShortURL := fmt.Sprintf("%s://%s/%s", scheme, r.Host, newLink.ShortURL)

	response := CreateURLResponse{ShortURL: fullShortURL}
	s.respondJSON(w, http.StatusCreated, response)
}

// GET /api/v1/links/{id}
func (s *Server) handleGetURL(w http.ResponseWriter, r *http.Request) {
	shortURL := strings.TrimPrefix(r.URL.Path, "/api/links/")

	link, err := s.db.GetLinkByShortCode(shortURL)
	if err != nil {
		s.respondError(w, http.StatusNotFound, "Link not found :/")
		return
	}

	s.respondJSON(w, http.StatusOK, link)
}

// UPDATE /api/v1/links/{id}
func (s *Server) handleUpdateURL(w http.ResponseWriter, r *http.Request) {
	shortURL := strings.TrimPrefix(r.URL.Path, "/api/links/")

	var req UpdateURLRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		s.respondError(w, http.StatusBadRequest, "Invalid request body :(")
		return
	}

	if _, err := url.ParseRequestURI(req.URL); err != nil {
		s.respondError(w, http.StatusBadRequest, "Invalid URL format :(")
		return
	}

	rowsAffected, err := s.db.UpdateURL(shortURL, req.URL)
	if err != nil {
		slog.Error("Database error on update url :(", "code", shortURL, "error", err)
		s.respondError(w, http.StatusInternalServerError, "Failed to update url :(")
		return
	}

	if rowsAffected == 0 {
		s.respondError(w, http.StatusNotFound, "URL not found :(")
		return
	}

	s.respondJSON(w, http.StatusOK, map[string]string{"message": "URL updated :D"})
}

// DELETE /api/v1/links/{id}
func (s *Server) handleDeleteURL(w http.ResponseWriter, r *http.Request) {
	shortURL := strings.TrimPrefix(r.URL.Path, "/api/links/")

	rowsAffected, err := s.db.DeleteURL(shortURL)
	if err != nil {
		slog.Error("Database error on delete url :(", "code", shortURL, "error", err)
		s.respondError(w, http.StatusInternalServerError, "Failed to delete url :(")
		return
	}

	if rowsAffected == 0 {
		s.respondError(w, http.StatusNotFound, "URL not found :(")
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
