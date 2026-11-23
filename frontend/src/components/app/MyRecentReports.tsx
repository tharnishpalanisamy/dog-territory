import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  FileText,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import api from "../../lib/api";

type ReportStatus =
  | "pending"
  | "in_progress"
  | "reviewed"
  | "resolved"
  | "completed"
  | "cancelled";

interface Report {
  id: number;
  reporter_id: number;
  dog_id: number | null;
  report_type: string;
  description: string | null;
  pincode: string;
  landmark: string;
  image_filename: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string | null;
}

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  in_progress: "bg-blue-50 text-blue-700",
  reviewed: "bg-emerald-50 text-emerald-700",
  resolved: "bg-green-50 text-green-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
};

const reportTypeLabels: Record<string, string> = {
  sick: "Medical Concern",
  injured: "Injured Dog",
  uncollared: "Uncollared Dog",
  stray: "Stray Dog",
  missing: "Missing Dog",
  aggressive: "Aggressive Behaviour",
};

function formatReportType(type: string) {
  return (
    reportTypeLabels[type.toLowerCase()] ||
    type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function MyRecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchRecentReports() {
    try {
      setLoading(true);
      setError(false);

      const response = await api.get<Report[]>("/reports/me", {
        params: {
          limit: 3,
        },
      });

      setReports(response.data.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch recent reports:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecentReports();
  }, []);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between gap-3">
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
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          View all
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />

          <p className="mt-3 text-sm text-slate-500">Loading your reports...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={22} />
          </div>

          <h3 className="mt-3 text-sm font-semibold text-slate-900">
            Couldn't load your reports
          </h3>

          <p className="mt-1 max-w-xs text-sm text-slate-500">
            Something went wrong while fetching your reports. Please try again.
          </p>

          <button
            onClick={fetchRecentReports}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={15} />
            Try again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
            <FileText size={26} />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-slate-900">
            No reports yet
          </h3>

          <p className="mt-1 max-w-xs text-sm text-slate-500">
            You haven't submitted any reports yet. Help a street dog by
            reporting a concern in your community.
          </p>

          <Link
            to="/user/reports/create"
            className="report-dog-action mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            <FileText size={17} strokeWidth={2.4} />
            Report a dog
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Reports List */}
      {!loading && !error && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <FileText size={20} />
              </div>

              {/* Report Details */}
              <div className="min-w-0 flex-1">
                {/* Title and Status */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {formatReportType(report.report_type)}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      statusStyles[report.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {formatStatus(report.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {report.description || "No description provided."}
                </p>

                {/* Metadata */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {report.landmark || "Location unavailable"}
                  </span>

                  {report.pincode && (
                    <span className="text-slate-400">{report.pincode}</span>
                  )}

                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} />
                    {formatDate(report.created_at)}
                  </span>
                </div>

                {/* View Report */}
                <Link
                  to={`/user/reports/${report.id}`}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  View report
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
