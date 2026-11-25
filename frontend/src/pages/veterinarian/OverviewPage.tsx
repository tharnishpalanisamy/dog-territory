
import { useAuth } from "../../hooks/useAuth";
import { PageHeader, StatCard } from "../../components/app/shared/Shared";
import DogsToExamine from "../../components/app/veterinarian/DogsToExamine";
import UpcomingCare from '../../components/app/veterinarian/UpcomingCare'
import RecentMedicalRecords from "../../components/app/veterinarian/RecentMedicalRecords";

export default function OverviewPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <PageHeader
        eyebrow="VETERINARY WORKSPACE"
        title={`Welcome back, ${user?.username ?? "Veterinarian"}`}
        description="Monitor your patients and manage their healthcare."
      />

      <div className="stats-grid">
        <StatCard
          label="Assigned dogs"
          value="12"
          icon="🐕"
          footnote="Under your care"
        />

        <StatCard
          label="Pending examinations"
          value="04"
          icon="🩺"
          footnote="Awaiting examination"
        />

        <StatCard
          label="Ongoing treatments"
          value="03"
          icon="💊"
          footnote="Currently treating"
        />

        <StatCard
          label="Vaccinations due"
          value="06"
          icon="💉"
          footnote="Require attention"
        />
      </div>

      <div className="mt-6">
        <DogsToExamine />
      </div>

      <div className="mt-6">
        <UpcomingCare />
      </div>

      <div className="mt-6">
        <RecentMedicalRecords />
      </div>
    </>
  );
}
