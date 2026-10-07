import type { Metadata } from "next";
import { HomeScreen } from "@/components/home/HomeScreen";

export const metadata: Metadata = {
  title: { absolute: "Siteworks" },
  description: "Order cement, hire equipment, and follow upcoming and ongoing construction projects.",
};

export default function HomePage() {
  return <HomeScreen />;
}
