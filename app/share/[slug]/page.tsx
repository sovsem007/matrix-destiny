import { redirect } from "next/navigation";
import { decodeShareData } from "@/lib/utils";

interface SharePageProps {
  params: { slug: string };
}

/**
 * Share page — decodes the slug (base64url params) and redirects
 * to the appropriate result page.
 *
 * Slug format: base64url(JSON.stringify({ type, dob?, name?, dob1?, name1?, dob2?, name2? }))
 */
export default function SharePage({ params }: SharePageProps) {
  const data = decodeShareData(params.slug);

  if (!data) {
    redirect("/");
  }

  if (data.type === "matrix" && data.dob) {
    const url = new URL("/matrix", "http://localhost");
    url.searchParams.set("dob", data.dob);
    if (data.name) url.searchParams.set("name", data.name);
    redirect(`/matrix?${url.searchParams.toString()}`);
  }

  if (data.type === "compatibility" && data.dob1 && data.dob2) {
    const url = new URL("/compatibility", "http://localhost");
    url.searchParams.set("dob1", data.dob1);
    url.searchParams.set("dob2", data.dob2);
    if (data.name1) url.searchParams.set("name1", data.name1);
    if (data.name2) url.searchParams.set("name2", data.name2);
    redirect(`/compatibility?${url.searchParams.toString()}`);
  }

  redirect("/");
}
