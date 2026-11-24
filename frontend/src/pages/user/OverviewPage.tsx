import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageHeader, StatCard } from "../../components/app/Shared";
import { ArrowRight, Plus } from "lucide-react";
import MyRecentReports from "../../components/app/MyRecentReports";
import RecentlySpottedDogs from "../../components/app/RecentlySpottedDogs";
import RabiesAwarenessCard from "../../components/app/RabiesAwarenessCard";
import api from "../../lib/api";

type UserLocation = {
  state: string;
  district: string;
  area_name: string;
  pincode: string;
};
type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  location?: UserLocation | null;
  state?: string | null;
  district?: string | null;
  area_name?: string | null;
  pincode?: string | null;
};

function hasLocation(user: User): boolean {
  const location = user.location ?? user;
  return Boolean(
    location.state?.trim() &&
    location.district?.trim() &&
    location.area_name?.trim() &&
    location.pincode?.trim(),
  );
}

async function fetch_statisitcs() {
  const response = await api.get("/users/statistics");
  return response.data;
}

export default function OverviewPage() {
  const navigate = useNavigate();

  const [user] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [statistics, setStatistics] = useState({
    dogs_nearby: 0,
    my_reports: 0,
    under_review: 0,
    resolved: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/signin", { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const locationProvided = hasLocation(user);

  useEffect(() => {
    fetch_statisitcs()
      .then((res) => setStatistics(res))
      .catch((error) => console.log("Failed to fetch statistics", error));
  }, []);

  return (
    <>
      <PageHeader
        eyebrow="COMMUNITY WORKSPACE"
        title={`Welcome back, ${user.username}`}
        description="Your small actions can make a big difference for street dogs."
        action={
          <Link
            to="/user/reports/create"
            className="report-dog-action inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <Plus size={17} strokeWidth={2.4} />
            Report a dog
            <ArrowRight size={16} />
          </Link>
        }
      />

      <div className="stats-grid">
        <StatCard
          label="Dogs nearby"
          value={locationProvided ? String(statistics.dogs_nearby) : "—"}
          icon="🐕"
          footnote={
            locationProvided
              ? "In your community"
              : "Add your pincode to discover dogs"
          }
        />

        <StatCard
          label="My reports"
          value={String(statistics.my_reports)}
          icon="📋"
          footnote="Reports submitted"
        />

        <StatCard
          label="Under review"
          value={String(statistics.under_review)}
          icon="⏳"
          footnote="Awaiting attention"
        />

        <StatCard
          label="Resolved reports"
          value={String(statistics.resolved)}
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
