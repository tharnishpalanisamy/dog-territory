
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  FileText,
} from "lucide-react";

type Report = {
  id: number;
  type: string;
  description: string;
  location: string;
  date: string;
  status: "pending" | "in_progress" | "reviewed" | "resolved";
};

const reports: Report[] = [
  {
    id: 1,
    type: "Medical concern",
    description: "Street dog with a visible injury near the market.",
    location: "Edayarpalayam",
    date: "Nov 11, 2026",
    status: "in_progress",
  },
  {
    id: 2,
    type: "Dog sighting",
    description: "Brown street dog spotted near the community park.",
    location: "TVS Nagar",
    date: "Nov 09, 2026",
    status: "reviewed",
  },
  {
    id: 3,
    type: "Lost dog",
    description: "Small white and brown dog wandering near the bus stop.",
    location: "Thudiyalur",
    date: "Nov 07, 2026",
    status: "pending",
  },
];

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  reviewed: "bg-emerald-50 text-emerald-700",
  resolved: "bg-green-50 text-green-700",
};

export default function MyRecentReports() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            My recent reports
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Track the reports you've submitted.
          </p>
        </div>

        <Link
          to="/user/reports"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {report.type}
                </h3>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                    statusStyles[report.status]
                  }`}
                >
                  {report.status.replace("_", " ")}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {report.description}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {report.location}
                </span>

                <span className="flex items-center gap-1">
                  <CalendarDays size={13} />
                  {report.date}
                </span>
              </div>

              <Link
                to={`/user/reports/${report.id}`}
                className="mt-2 inline-flex text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View report →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
