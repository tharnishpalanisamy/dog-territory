
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/app/Shared";
import AvailableTasks from "../../components/app/AvailableTasks";
import MyAssignments from "../../components/app/MyAssignments";
import RecentActivity from "../../components/app/RecentActivity";
import type{ AssignmentActivity } from "../../components/app/RecentActivity";

type User = {
  id: number;
  username: string;
  email: string;
};

const volunteerActivities: AssignmentActivity[] = [
  {
    id: 1,
    updateType: "progress",
    description: "Your assignment has been marked as in progress.",
    assignmentTitle: "Medical care assistance",
    updatedBy: "You",
    createdAt: "Today",
  },
  {
    id: 2,
    updateType: "note",
    description: "The coordinator added instructions for your visit.",
    assignmentTitle: "Street dog transportation",
    updatedBy: "Admin",
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
        eyebrow="VOLUNTEER WORKSPACE"
        title={`Welcome back, ${user.username}`}
        description="Your time and care make a difference. Here's your fieldwork overview."
        action={
          <a
            href="/volunteer/tasks"
            className="button-primary"
          >
            Explore tasks →
          </a>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="My assignments"
          value="08"
          icon="📋"
          footnote="All assigned tasks"
        />

        <StatCard
          label="Available tasks"
          value="12"
          icon="🐾"
          footnote="Ready to be claimed"
        />

        <StatCard
          label="In progress"
          value="03"
          icon="⏳"
          footnote="Currently working on"
        />

        <StatCard
          label="Completed"
          value="15"
          icon="✓"
          footnote="Your completed tasks"
        />
      </div>
      <div className="mt-6">
        <AvailableTasks />
    </div>
    <div className="mt-6">
        <MyAssignments />
    </div>

    <div className="mt-6">
  <RecentActivity
        activities={volunteerActivities}
        title="My recent updates"
        subtitle="Latest updates on your assignments."
    />
    </div>
    </>
  );
}
