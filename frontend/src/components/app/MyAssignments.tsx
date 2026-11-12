
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  ClipboardList,
} from "lucide-react";

type Assignment = {
  id: number;
  title: string;
  description: string;
  area: string;
  status: "accepted" | "in_progress";
  dueDate: string;
};

const assignments: Assignment[] = [
  {
    id: 1,
    title: "Medical care assistance",
    description: "Coordinate veterinary treatment for an injured street dog.",
    area: "Coimbatore North",
    status: "in_progress",
    dueDate: "Nov 14, 2026",
  },
  {
    id: 2,
    title: "Street dog transportation",
    description: "Transport a dog safely to the veterinary clinic.",
    area: "Edayarpalayam",
    status: "accepted",
    dueDate: "Nov 15, 2026",
  },
];

const statusStyles = {
  accepted: "bg-blue-50 text-blue-700",
  in_progress: "bg-amber-50 text-amber-700",
};

export default function MyAssignments() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            My active assignments
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Tasks you've accepted and are working on.
          </p>
        </div>

        <Link
          to="/volunteer/assignments"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      {assignments.length === 0 ? (
        <div className="py-8 text-center">
          <ClipboardList
            size={28}
            className="mx-auto mb-2 text-slate-300"
          />
          <p className="text-sm font-medium text-slate-600">
            No active assignments
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Explore available tasks to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <ClipboardList size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {assignment.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[assignment.status]
                    }`}
                  >
                    {assignment.status === "in_progress"
                      ? "In progress"
                      : "Accepted"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {assignment.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {assignment.area}
                  </span>

                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} />
                    {assignment.dueDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
