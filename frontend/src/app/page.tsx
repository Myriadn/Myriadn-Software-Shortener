"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { shortenUrl } from "@/lib/api";

type FormData = {
  originalUrl: string;
};

export default function Home() {
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await shortenUrl(data.originalUrl);
      // Karena backend tidak mengembalikan shortUrl, kita perlu membuatnya
      const shortUrl = `${process.env.NEXT_PUBLIC_API_URL}/${response.id}`;
      setShortUrl(shortUrl);
      toast.success("URL shortened successfully!");
      reset();
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast.error("Failed to shorten URL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast.success("Copied to clipboard!");
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow flex flex-col items-center justify-center container-custom py-12">
        <h1 className="text-4xl font-bold text-center mb-2">URL Shortener</h1>
        <p className="text-gray-600 text-center mb-8 max-w-2xl">
          Create short and memorable links with our powerful URL shortener
          service.
        </p>

        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                htmlFor="originalUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your long URL
              </label>
              <input
                id="originalUrl"
                type="url"
                placeholder="https://example.com/very/long/url/that/needs/to/be/shortened"
                className="form-input"
                {...register("originalUrl", {
                  required: "URL is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: "Please enter a valid URL",
                  },
                })}
              />
              {errors.originalUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.originalUrl.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten URL"}
            </button>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Your shortened URL:
              </p>
              <div className="flex items-center">
                <div className="flex-grow p-2 bg-white border border-gray-300 rounded-l-md truncate">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {shortUrl}
                  </a>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-primary text-white rounded-r-md hover:bg-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Easy to Use</h3>
            <p className="text-gray-600">
              Simply paste your long URL and get a shortened link in seconds.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Track Clicks</h3>
            <p className="text-gray-600">
              Monitor how many people are clicking on your shortened URLs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Secure & Reliable</h3>
            <p className="text-gray-600">
              All links are secure and available whenever you need them.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
