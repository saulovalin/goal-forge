import { GoalDetails } from "@/components/GoalDetails";

export default async function GoalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GoalDetails id={id}/>;
}
