"use client";

import "dotenv/config";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserUrls, deleteUrl } from "@/lib/api";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type UrlData = {
  id: string;
  url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  clicks?: number;
  // Frontend properties
  shortUrl?: string;
  originalUrl?: string;
  createdAt?: string;
  shortId?: string;
};

export default function Dashboard() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchUrls();
  }, [router]);
  const fetchUrls = async () => {
    try {
      setIsLoading(true);
      const data = await getUserUrls();
      // Transform data to include shortUrl
      const transformedData = data.map((url: UrlData) => ({
        ...url,
        shortUrl: `${window.location.origin}/${url.id}`,
        originalUrl: url.url,
        createdAt: url.created_at,
        shortId: url.id,
        clicks: url.clicks || 0,
      }));
      setUrls(transformedData);
    } catch (error) {
      console.error("Error fetching URLs:", error);
      toast.error("Failed to load your URLs");
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this URL?")) {
      try {
        await deleteUrl(id);
        setUrls(urls.filter((url) => url.id !== id));
        toast.success("URL deleted successfully");
      } catch (error) {
        console.error("Error deleting URL:", error);
        toast.error("Failed to delete URL");
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-grow container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Your URLs</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : urls.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              You haven't created any short URLs yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first short URL and track its performance.
            </p>
            <button onClick={() => router.push("/")} className="btn-primary">
              Create URL
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Original URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Short URL
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Clicks
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {urls.map((url) => (
                    <tr key={url.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 truncate max-w-xs">
                          {url.originalUrl || url.url}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <a
                            href={url.shortUrl || `/${url.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline mr-2"
                          >
                            {url.id}
                          </a>
                          <button
                            onClick={() =>
                              copyToClipboard(
                                url.shortUrl ||
                                  `${window.location.origin}/${url.id}`
                              )
                            }
                            className="text-gray-500 hover:text-primary"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {url.clicks}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(
                            url.createdAt || url.created_at
                          ).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/dashboard/${url.id}`)}
                          className="text-primary hover:text-blue-800 mr-4"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleDelete(url.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
