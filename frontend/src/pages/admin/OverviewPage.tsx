
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/app/Shared";
import PendingVolunteerApplications from
  "../../components/app/PendingVolunteerApplications";
import RecentReports from "../../components/app/RecentReports";
import AssignmentOverview from "../../components/app/AssignmentOverview";
import RecentActivity, {
  type AssignmentActivity,
} from "../../components/app/RecentActivity";


type User = {
  id: number;
  username: string;
  email: string;
};

const recentActivities: AssignmentActivity[] = [
  {
    id: 1,
    updateType: "progress",
    description: "Initial treatment completed successfully.",
    assignmentTitle: "Medical care - Dog #TN-CBE-001",
    updatedBy: "Volunteer Arun",
    createdAt: "Today",
  },
  {
    id: 2,
    updateType: "issue",
    description: "Dog requires additional medical attention.",
    assignmentTitle: "Medical care - Dog #TN-CBE-004",
    updatedBy: "Volunteer Priya",
    createdAt: "Yesterday",
  },
  {
    id: 3,
    updateType: "location",
    description: "Dog location updated after field visit.",
    assignmentTitle: "Rescue - Dog #TN-CBE-008",
    updatedBy: "Volunteer Karthik",
    createdAt: "Yesterday",
  },
];

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
        eyebrow="ADMINISTRATION"
        title={`Welcome back, ${user.username}`}
        description="Here's what's happening across Dog Territory today."
      />

      <div className="stats-grid">
        <StatCard
          label="Total dogs"
          value="128"
          icon="🐕"
          footnote="Registered on the platform"
        />

        <StatCard
          label="Pending reports"
          value="08"
          icon="📋"
          footnote="Require your attention"
        />

        <StatCard
          label="Approved volunteers"
          value="24"
          icon="🤝"
          footnote="Active on the platform"
        />

        <StatCard
          label="Pending applications"
          value="05"
          icon="👤"
          footnote="Awaiting verification"
        />
        
      </div>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <PendingVolunteerApplications />
            <RecentReports />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            <AssignmentOverview />
            <RecentActivity activities={recentActivities} />
        </div>
    </>
  );
}
