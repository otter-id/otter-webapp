import type { Metadata } from "next";
import { ApiGetRestaurantInfo } from "@/app/api";
import { FoodOrderingClient } from "@/components/order/food-ordering-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generate dynamic metadata untuk SEO dan OG tags
 * Metadata ini akan di-render di server-side untuk setiap store
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await ApiGetRestaurantInfo(id);
  if (result.status >= 400) throw new Error(result.response?.message || result.statusText);
  const restaurantData = result.data;

  // Default metadata jika restaurant tidak ditemukan
  if (!restaurantData) {
    return {
      title: "Otter – Order Online",
      description: "Order food and drinks online with Otter",
      openGraph: {
        title: "Otter – Order Online",
        description: "Order food and drinks online with Otter",
        images: [
          {
            url: "https://app.otter.id/og-default.png",
            width: 1200,
            height: 630,
            alt: "Otter",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Otter – Order Online",
        description: "Order food and drinks online with Otter",
      },
    };
  }

  // Dynamic metadata berdasarkan data restaurant
  const title = `${restaurantData.name} – Order Online`;
  const description = `Order online and track your order live. Powered by Otter`;
  const imageUrl = restaurantData.image || restaurantData.logo;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: restaurantData.name,
        },
      ],
      type: "website",
      siteName: "Otter",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    // Metadata tambahan untuk WhatsApp dan social media lainnya
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
    },
  };
}

/**
 * Page component untuk store ordering
 * Ini adalah server component yang render client component
 *
 */
export default async function FoodOrderingPage({ params }: PageProps) {
  const { id } = await params;

  return <FoodOrderingClient storeId={id} />;
}
