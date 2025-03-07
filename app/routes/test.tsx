import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Rider KYC" },
    { name: "description", content: "" },
  ];
}

export default function Home() {
  return <></>;
}

