import type { Route } from "./+types/home";
import RiderKYCForm from "~/components/other/Form";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Rider KYC" },
    { name: "description", content: "" },
  ];
}

export default function Home() {
  return <RiderKYCForm />;
}
