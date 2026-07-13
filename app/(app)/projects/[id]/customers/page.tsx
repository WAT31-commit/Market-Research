import { notFound } from "next/navigation";
import { requireProjectOwner } from "@/lib/project-auth";
import { getProjectSections } from "@/lib/sections.server";
import { SectionCard } from "@/components/reports/section-card";
import { PersonaCards, SegmentBars } from "@/components/reports/content-views";

export default async function CustomersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { project } = await requireProjectOwner(id);
  if (!project) notFound();

  const sections = await getProjectSections(id);
  const personas = sections.CUSTOMER_PERSONA;
  const segments = sections.CUSTOMER_SEGMENTATION;

  return (
    <div className="space-y-6">
      <SectionCard
        projectId={id}
        type="CUSTOMER_PERSONA"
        title="Customer Personas"
        source={personas?.source ?? null}
        confidenceScore={personas?.confidenceScore ?? null}
        empty={!personas}
      >
        {personas && <PersonaCards content={personas.content} />}
      </SectionCard>

      <SectionCard
        projectId={id}
        type="CUSTOMER_SEGMENTATION"
        title="Customer Segmentation"
        source={segments?.source ?? null}
        confidenceScore={segments?.confidenceScore ?? null}
        empty={!segments}
      >
        {segments && <SegmentBars content={segments.content} />}
      </SectionCard>
    </div>
  );
}
