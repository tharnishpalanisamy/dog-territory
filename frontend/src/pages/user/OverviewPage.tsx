
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/app/Shared";
import { Plus } from "lucide-react";
import MyRecentReports from "../../components/app/MyRecentReports";
import RecentlySpottedDogs from '../../components/app/RecentlySpottedDogs'
import RabiesAwarenessCard from "../../components/app/RabiesAwarenessCard";

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
        eyebrow="COMMUNITY WORKSPACE"
        title={`Welcome back, ${user.username}`}
        description="Your small actions can make a big difference for street dogs."
        action={
          <Link
            to="/user/reports/create"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            Report a dog
          </Link>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="Dogs nearby"
          value="24"
          icon="🐕"
          footnote="In your community"
        />

        <StatCard
          label="My reports"
          value="08"
          icon="📋"
          footnote="Reports submitted"
        />

        <StatCard
          label="Under review"
          value="03"
          icon="⏳"
          footnote="Awaiting attention"
        />

        <StatCard
          label="Resolved reports"
          value="05"
          icon="💚"
          footnote="Successfully addressed"
        />
      </div>

      <div className="mt-6">
        <MyRecentReports />
      </div> 

      <div className="mt-6">
        <RecentlySpottedDogs />
      </div>

      <div className="mt-6">
        <RabiesAwarenessCard />
      </div>
    </>
  );
}
