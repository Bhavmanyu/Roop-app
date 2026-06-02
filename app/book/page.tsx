import type { Metadata } from "next";
import BookClient from "./BookClient";

export const metadata: Metadata = {
  title: "Schedule Your Luxury Doorstep Beauty Service — Roopé",
  description:
    "Complete your premium beauty, bridal glam, or grooming reservation on Roopé. Secure and real-time checkout for verified home spa and salon sessions in Indore.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BookPage() {
  return <BookClient />;
}
