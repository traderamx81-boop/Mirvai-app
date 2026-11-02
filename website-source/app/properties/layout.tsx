import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Properties for Sale in Lagos",
  description: "Browse Mirvai property opportunities across Lagos Mainland and Lagos Island.",
  alternates: { canonical: "/properties" },
};

export default function PropertiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
