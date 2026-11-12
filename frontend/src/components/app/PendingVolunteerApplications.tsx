
import { Link } from "react-router-dom";
import { Clock, MapPin, UserRound, ArrowRight } from "lucide-react";

type Application = {
  id: number;
  username: string;
  email: string;
  area: string;
  appliedAt: string;
};

const applications: Application[] = [
  {
    id: 1,
    username: "Arun Kumar",
    email: "arun@example.com",
    area: "Coimbatore North",
    appliedAt: "Today",
  },
  {
    id: 2,
    username: "Priya S",
    email: "priya@example.com",
    area: "Edayarpalayam",
    appliedAt: "Yesterday",
  },
  {
    id: 3,
    username: "Karthik R",
    email: "karthik@example.com",
    area: "Thudiyalur",
    appliedAt: "2 days ago",
  },
];

export default function PendingVolunteerApplications() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Pending volunteer applications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review people who want to join your community.
          </p>
        </div>

        <Link
          to="/admin/volunteers"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <UserRound size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {application.username}
              </h3>

              <p className="truncate text-xs text-slate-500">
                {application.email}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {application.area}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {application.appliedAt}
                </span>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
              Pending
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
