import type { Metadata } from "next";
import ViolationAnalyzer from "./ViolationAnalyzer";

export const metadata: Metadata = {
  title: "Ad Rejection Insights",
  description:
    "Drill from campaigns to rejected ads, then see the exact frame and element that caused the rejection.",
};

export default function Home() {
  return <ViolationAnalyzer />;
}
