package shortener

import (
	"crypto/rand"
	"math/big"
)

const (
	alphabet        = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	shortCodeLength = 7
)

// GeneratorShortURL string
func GenerateShortURL() (string, error) {
	result := make([]byte, shortCodeLength)
	for i := range result {
		num, err := rand.Int(rand.Reader, big.NewInt(int64(len(alphabet))))
		if err != nil {
			return "", err
		}

		result[i] = alphabet[num.Int64()]
	}

	return string(result), nil
}
