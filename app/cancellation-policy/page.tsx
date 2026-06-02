import type { Metadata } from "next";
import CancellationPolicyClient from "./CancellationPolicyClient";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — Roopé",
  description:
    "Review the booking cancellation, reschedule, and refund terms of service for Roopé doorstep luxury salon treatments in Indore.",
  alternates: {
    canonical: "/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  return <CancellationPolicyClient />;
}
