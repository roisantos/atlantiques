export interface Painting {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrls: string[];  // Changed from single imageUrl to array
  stripePaymentLink: string;
  dimensions: string;
  medium: string;
  year: string;
  pdfReport: string;  // Added PDF report URL
}