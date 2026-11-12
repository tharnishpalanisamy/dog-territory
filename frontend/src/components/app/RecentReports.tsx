
import { Link } from "react-router-dom";
import { reports } from "../../data/mockData";
import { StatusBadge } from "./Shared";
import { ArrowRight, MapPin } from "lucide-react";

export default function RecentReports() {
  const recentReports = reports.slice(0, 4);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent reports
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest reports from the community.
          </p>
        </div>

        <Link
          to="/admin/reports"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {recentReports.map((report) => (
          <Link
            to={`/admin/reports/${report.id}`}
            key={report.id}
            className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <img
              src={report.image}
              alt="Reported dog"
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-slate-900">
                {report.type}
              </h3>

              <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                {report.description}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={12} />
                {report.latitude.toFixed(3)}, {report.longitude.toFixed(3)}
                <span>· {report.date}</span>
              </div>
            </div>

            <div className="shrink-0">
              <StatusBadge status={report.status} />
            </div>
          </Link>
        ))}

        {recentReports.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            No reports available yet.
          </p>
        )}
      </div>
    </section>
  );
}
