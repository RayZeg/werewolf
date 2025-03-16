async function page({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  return <div>{gameId}</div>;
}

export default page;
