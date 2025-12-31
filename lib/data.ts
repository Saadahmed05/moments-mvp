export interface Moment {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  city: string;
  category: string;
}

export const moments: Moment[] = [
  {
    id: "1",
    title: "Sunset Rooftop Coffee",
    description: "Enjoy a serene evening with premium coffee while watching the sunset from a beautiful rooftop location. Perfect for unwinding after a long day.",
    duration: "1 hour",
    price: 25,
    city: "Dubai",
    category: "Relaxation"
  },
  {
    id: "2",
    title: "BMW M2 Ride",
    description: "Experience the thrill of driving a powerful BMW M2 sports car. Feel the adrenaline rush as you navigate through scenic routes with this high-performance machine.",
    duration: "2 hours",
    price: 150,
    city: "Los Angeles",
    category: "Adventure"
  },
  {
    id: "3",
    title: "Superbike Pillion Ride",
    description: "Hold on tight for an exhilarating pillion ride on a high-speed superbike. Experience the rush of wind and speed as you cruise through the city streets.",
    duration: "1.5 hours",
    price: 80,
    city: "Tokyo",
    category: "Adventure"
  }
];


