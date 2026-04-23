import featurePhoto from "@assets/IMG-20260423-WA0005_1776950452874.jpg";
import portraits1 from "@/assets/portraits-1.png";
import portraits2 from "@/assets/portraits-2.png";
import portraits3 from "@/assets/portraits-3.png";
import portraits4 from "@/assets/portraits-4.png";
import portraits5 from "@/assets/portraits-5.png";

import street1 from "@/assets/street-1.png";
import street2 from "@/assets/street-2.png";

export interface Photo {
  id: string;
  src: string;
  title: string;
  category: "Portraits" | "Street" | "Cultural" | "Events" | "Landscapes";
  subCategory?: string;
  aspectRatio: "portrait" | "landscape" | "square";
}

export const photos: Photo[] = [
  // FEATURED
  {
    id: "feature-1",
    src: featurePhoto,
    title: "Pune Street Moment",
    category: "Street",
    subCategory: "Pune",
    aspectRatio: "portrait",
  },
  
  // PORTRAITS
  {
    id: "portraits-1",
    src: portraits1,
    title: "Wisdom",
    category: "Portraits",
    aspectRatio: "portrait",
  },
  {
    id: "portraits-2",
    src: portraits2,
    title: "Train Journey",
    category: "Portraits",
    aspectRatio: "landscape",
  },
  {
    id: "portraits-3",
    src: portraits3,
    title: "The Artisan",
    category: "Portraits",
    aspectRatio: "portrait",
  },
  {
    id: "portraits-4",
    src: portraits4,
    title: "Joy",
    category: "Portraits",
    aspectRatio: "square",
  },
  {
    id: "portraits-5",
    src: portraits5,
    title: "Companions",
    category: "Portraits",
    aspectRatio: "landscape",
  },
  
  // STREET
  {
    id: "street-1",
    src: street1,
    title: "Market Chaos",
    category: "Street",
    subCategory: "Pune",
    aspectRatio: "landscape",
  },
  {
    id: "street-2",
    src: street2,
    title: "Monsoon Reflections",
    category: "Street",
    subCategory: "Vadgaon",
    aspectRatio: "landscape",
  },
  {
    id: "street-3",
    src: "/images/cultural-stock_1.jpg", // Using a stock image as placeholder for street
    title: "Alleyway",
    category: "Street",
    subCategory: "Talegaon",
    aspectRatio: "portrait",
  },
  {
    id: "street-4",
    src: "/images/cultural-stock_2.jpg", 
    title: "Evening Commute",
    category: "Street",
    subCategory: "Pune",
    aspectRatio: "landscape",
  },
  
  // CULTURAL
  {
    id: "cultural-1",
    src: "/images/cultural-stock_1.jpg",
    title: "Ganpati Devotion",
    category: "Cultural",
    subCategory: "Ganpati",
    aspectRatio: "portrait",
  },
  {
    id: "cultural-2",
    src: "/images/cultural-stock_2.jpg",
    title: "Festival Lights",
    category: "Cultural",
    subCategory: "Diwali",
    aspectRatio: "landscape",
  },
  {
    id: "cultural-3",
    src: "/images/cultural-stock_1.jpg",
    title: "Gudi Padwa Procession",
    category: "Cultural",
    subCategory: "Gudi Padwa",
    aspectRatio: "landscape",
  },
  
  // EVENTS
  {
    id: "events-1",
    src: "/images/events-stock_1.jpg",
    title: "Akhada Match",
    category: "Events",
    subCategory: "Wrestling",
    aspectRatio: "landscape",
  },
  {
    id: "events-2",
    src: "/images/events-stock_2.jpg",
    title: "Red Soil",
    category: "Events",
    subCategory: "Wrestling",
    aspectRatio: "portrait",
  },
  {
    id: "events-3",
    src: "/images/events-stock_1.jpg",
    title: "Kathak Performance",
    category: "Events",
    subCategory: "Live Dance Show",
    aspectRatio: "landscape",
  },
  
  // LANDSCAPES
  {
    id: "landscapes-1",
    src: "/images/landscapes-stock_1.jpg",
    title: "Western Ghats",
    category: "Landscapes",
    aspectRatio: "landscape",
  },
  {
    id: "landscapes-2",
    src: "/images/landscapes-stock_2.jpg",
    title: "Morning Mist",
    category: "Landscapes",
    aspectRatio: "landscape",
  }
];

export const categories = {
  portraits: photos.filter(p => p.category === "Portraits"),
  street: photos.filter(p => p.category === "Street"),
  cultural: photos.filter(p => p.category === "Cultural"),
  events: photos.filter(p => p.category === "Events"),
  landscapes: photos.filter(p => p.category === "Landscapes"),
};

export const featuredPhotos = [
  featurePhoto,
  portraits3,
  street1,
  portraits1,
  street2,
  portraits5
];
