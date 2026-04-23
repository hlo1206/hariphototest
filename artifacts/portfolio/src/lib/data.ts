import featurePhoto from "@assets/IMG-20260423-WA0005_1776950452874.jpg";

export interface Photo {
  id: string;
  src: string;
  title: string;
  category: "Portraits" | "Street" | "Cultural" | "Events" | "Landscapes";
  subCategory?: string;
  aspectRatio: "portrait" | "landscape" | "square";
}

export const photos: Photo[] = [
  {
    id: "street-pune-1",
    src: featurePhoto,
    title: "Pune Street Moment",
    category: "Street",
    subCategory: "Pune",
    aspectRatio: "portrait",
  },
];

export const categories = {
  portraits: photos.filter((p) => p.category === "Portraits"),
  street: photos.filter((p) => p.category === "Street"),
  cultural: photos.filter((p) => p.category === "Cultural"),
  events: photos.filter((p) => p.category === "Events"),
  landscapes: photos.filter((p) => p.category === "Landscapes"),
};

export const featuredPhotos = [featurePhoto];
