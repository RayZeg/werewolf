import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  return <div className="text-3xl text-white">Home {session?.username}</div>;
}
