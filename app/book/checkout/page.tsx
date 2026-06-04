import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Complete Booking | Roopé Luxury Beauty",
  description:
    "Confirm your Roopé luxury beauty session — pick your date, time, and address for premium at-home service in Indore.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
