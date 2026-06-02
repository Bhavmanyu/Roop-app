import type { Metadata } from "next";
import CookiePolicyClient from "./CookiePolicyClient";

export const metadata: Metadata = {
  title: "Cookie Policy — Roopé Beauty",
  description:
    "Learn about how Roopé uses cookies and local storage to optimize your luxury doorstep beauty booking and personalization experience.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function CookiePolicyPage() {
  return <CookiePolicyClient />;
}
