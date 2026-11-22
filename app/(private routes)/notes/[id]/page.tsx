import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import { OG_IMAGE, SITE_URL } from "@/lib/seo";
import NoteDetailsClient from "./NoteDetails.client";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

const MAX_DESCRIPTION_LENGTH = 160;

export const generateMetadata = async ({
  params,
}: NoteDetailsProps): Promise<Metadata> => {
  const { id } = await params;
  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;
  const description =
    note.content.length > MAX_DESCRIPTION_LENGTH
      ? `${note.content.slice(0, MAX_DESCRIPTION_LENGTH - 3)}...`
      : note.content || `Note "${note.title}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/notes/${id}`,
      images: [OG_IMAGE],
    },
  };
};

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default NoteDetails;
