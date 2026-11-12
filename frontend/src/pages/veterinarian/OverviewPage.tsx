
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/app/Shared";
import DogsToExamine from "../../components/app/DogsToExamine";
import UpcomingCare from '../../components/app/UpcomingCare'
import RecentMedicalRecords from "../../components/app/RecentMedicalRecords";

type User = {
  id: number;
  username: string;
  email: string;
};

export default function OverviewPage() {
  const navigate = useNavigate();

  const [user] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <>
      <PageHeader
        eyebrow="VETERINARY WORKSPACE"
        title={`Welcome back, ${user.username}`}
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
