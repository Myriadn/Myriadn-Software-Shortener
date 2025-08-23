package server

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Myriadn/Myriadn-Software-Shortener/internal/database"
)

// setupTestServer adalah fungsi helper untuk inisialisasi server dan db in-memory.
// Ini memastikan setiap test case berjalan di lingkungan yang bersih.
func setupTestServer(t *testing.T) *Server {
	// Gunakan database in-memory untuk testing: bersih, cepat, dan terisolasi.
	db, err := database.NewStore(":memory:")
	if err != nil {
		t.Fatalf("Gagal membuat in-memory db: %v", err)
	}

	// Inisialisasi schema dari file schema.sql
	schema, err := os.ReadFile("../../schema.sql")
	if err != nil {
		t.Fatalf("Gagal membaca schema.sql: %v", err)
	}
	if err := db.Init(string(schema)); err != nil {
		t.Fatalf("Gagal menginisialisasi schema: %v", err)
	}

	// Buat server state dengan db in-memory
	serverState := &Server{
		port: 8080,
		db:   db,
	}

	return serverState
}

// TestFullAPILifecycle menguji seluruh alur kerja CRUD dan Redirect.
func TestFullAPILifecycle(t *testing.T) {
	// 1. Setup Awal
	serverState := setupTestServer(t)
	router := serverState.RegisterRoutes()
	const shortCode = "test-crud"

	// =================================================================================
	// Skenario 1: Membuat Link Baru (POST /api/links)
	// =================================================================================
	t.Run("CREATE: should create a new link", func(t *testing.T) {
		reqBody := `{"url": "https://initial-url.com", "custom_code": "` + shortCode + `"}`
		req := httptest.NewRequest(http.MethodPost, "/api/links", bytes.NewBufferString(reqBody))
		rr := httptest.NewRecorder()

		router.ServeHTTP(rr, req)

		// Assertions
		if rr.Code != http.StatusCreated {
			t.Fatalf("CREATE failed: expected status %d, got %d", http.StatusCreated, rr.Code)
		}
	})

	// =================================================================================
	// Skenario 2: Mengambil Link yang Baru Dibuat (GET /api/links/{code})
	// =================================================================================
	t.Run("READ: should get the created link", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/links/"+shortCode, nil)
		rr := httptest.NewRecorder()

		router.ServeHTTP(rr, req)

		// Assertions
		if rr.Code != http.StatusOK {
			t.Fatalf("READ failed: expected status %d, got %d", http.StatusOK, rr.Code)
		}

		var link database.Link
		if err := json.NewDecoder(rr.Body).Decode(&link); err != nil {
			t.Fatalf("READ failed: could not decode response body: %v", err)
		}
		if link.OriginalURL != "https://initial-url.com" {
			t.Errorf("READ failed: expected original URL %s, got %s", "https://initial-url.com", link.OriginalURL)
		}
	})

	// =================================================================================
	// Skenario 3: Memperbarui Link (PUT /api/links/{code})
	// =================================================================================
	t.Run("UPDATE: should update an existing link", func(t *testing.T) {
		reqBody := `{"url": "https://updated-url.com"}`
		req := httptest.NewRequest(http.MethodPut, "/api/links/"+shortCode, bytes.NewBufferString(reqBody))
		rr := httptest.NewRecorder()

		router.ServeHTTP(rr, req)

		// Assertions
		if rr.Code != http.StatusOK {
			t.Fatalf("UPDATE failed: expected status %d, got %d", http.StatusOK, rr.Code)
		}

		// Verifikasi bahwa data di DB benar-benar berubah
		link, err := serverState.db.GetLinkByShortCode(shortCode)
		if err != nil {
			t.Fatalf("UPDATE verification failed: could not get link from db: %v", err)
		}
		if link.OriginalURL != "https://updated-url.com" {
			t.Errorf("UPDATE verification failed: expected updated URL %s, got %s", "https://updated-url.com", link.OriginalURL)
		}
	})

	// =================================================================================
	// Skenario 4: Menguji Redirect (GET /{code})
	// =================================================================================
	t.Run("REDIRECT: should redirect to the updated url", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/"+shortCode, nil)
		rr := httptest.NewRecorder()

		router.ServeHTTP(rr, req)

		// Assertions
		if rr.Code != http.StatusMovedPermanently {
			t.Fatalf("REDIRECT failed: expected status %d, got %d", http.StatusMovedPermanently, rr.Code)
		}

		// Cek header "Location" untuk memastikan redirect ke URL yang benar
		location := rr.Header().Get("Location")
		if location != "https://updated-url.com" {
			t.Errorf("REDIRECT failed: expected redirect to %s, got %s", "https://updated-url.com", location)
		}
	})

	// =================================================================================
	// Skenario 5: Menghapus Link (DELETE /api/links/{code})
	// =================================================================================
	t.Run("DELETE: should delete the link", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/api/links/"+shortCode, nil)
		rr := httptest.NewRecorder()

		router.ServeHTTP(rr, req)

		// Assertions
		if rr.Code != http.StatusNoContent {
			t.Fatalf("DELETE failed: expected status %d, got %d", http.StatusNoContent, rr.Code)
		}
	})

	// =================================================================================
	// Skenario 6: Menguji Kasus Gagal (GET data yang sudah dihapus)
	// =================================================================================
	t.Run("FAILURE: should not find the deleted link", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/links/"+shortCode, nil)
		rr := httptest.NewRecorder()

		router.ServeHTTP(rr, req)

		// Assertions
		if rr.Code != http.StatusNotFound {
			t.Fatalf("FAILURE test failed: expected status %d, got %d", http.StatusNotFound, rr.Code)
		}
	})
}
