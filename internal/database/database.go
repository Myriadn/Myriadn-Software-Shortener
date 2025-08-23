package database

import (
	"database/sql"
	"errors"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

var (
	ErrLinkNotFound    = errors.New("i don't know")
	ErrShortCodeExists = errors.New("try another short url")
)

type Link struct {
	ID          int64     `json:"id"`
	ShortURL    string    `json:"short_url"`
	OriginalURL string    `json:"original_url"`
	CreatedAt   time.Time `json:"created_at"`
}

type Store struct {
	db *sql.DB
}

// Connect it
func NewStore(dbPath string) (*Store, error) {
	db, err := sql.Open("sqlite3", dbPath+"?_foreign_keys=on")
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Store{
		db: db,
	}, nil
}

// Init Schema
func (s *Store) Init(schema string) error {
	_, err := s.db.Exec(schema)
	return err
}

// Stop it
func (s *Store) Close() error {
	return s.db.Close()
}

// --- CRUD System --- //
func (s *Store) GetLinkByShortCode(shortURL string) (*Link, error) {
	link := &Link{}
	query := `SELECT id, short_url, original_url, created_at FROM links WHERE short_url = ?`
	row := s.db.QueryRow(query, shortURL)
	err := row.Scan(&link.ID, &link.ShortURL, &link.OriginalURL, &link.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, ErrLinkNotFound
		}
		return nil, err
	}

	return link, nil
}

func (s *Store) SaveLink(link *Link) (int64, error) {
	// Checking the short url if exist
	_, err := s.GetLinkByShortCode(link.ShortURL)
	if err == nil {
		return 0, ErrShortCodeExists
	}
	if !errors.Is(err, ErrLinkNotFound) {
		return 0, err
	}

	query := `INSERT INTO links (short_url, original_url) VALUES (?, ?)`
	res, err := s.db.Exec(query, link.ShortURL, link.OriginalURL)
	if err != nil {
		return 0, err
	}

	return res.LastInsertId()
}

func (s *Store) UpdateURL(shortURL, newOriginalURL string) (int64, error) {
	query := `UPDATE links SET original_url = ? WHERE short_url = ?`
	res, err := s.db.Exec(query, newOriginalURL, shortURL)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}

func (s *Store) DeleteURL(shortURL string) (int64, error) {
	query := `DELETE FROM links WHERE short_url = ?`
	res, err := s.db.Exec(query, shortURL)
	if err != nil {
		return 0, err
	}

	return res.RowsAffected()
}
