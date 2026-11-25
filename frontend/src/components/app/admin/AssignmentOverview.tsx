
import { ClipboardList, CheckCircle2, Clock, PlayCircle } from "lucide-react";

type AssignmentStats = {
  open: number;
  accepted: number;
  inProgress: number;
  completed: number;
};

const stats: AssignmentStats = {
  open: 12,
  accepted: 8,
  inProgress: 10,
  completed: 36,
};

const total =
  stats.open +
  stats.accepted +
  stats.inProgress +
  stats.completed;

const items = [
  {
    label: "Available",
    value: stats.open,
    color: "bg-indigo-500",
    icon: ClipboardList,
  },
  {
    label: "Accepted",
    value: stats.accepted,
    color: "bg-sky-500",
    icon: Clock,
  },
  {
    label: "In progress",
    value: stats.inProgress,
    color: "bg-amber-500",
    icon: PlayCircle,
  },
  {
    label: "Completed",
    value: stats.completed,
    color: "bg-emerald-500",
    icon: CheckCircle2,
  },
];

export default function AssignmentOverview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">
          Assignment overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Track community care work across the platform.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl bg-slate-50 p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <Icon size={17} className="text-slate-500" />
                <span className="text-xl font-bold text-slate-900">
                  {item.value}
                </span>
              </div>

              <p className="text-xs font-medium text-slate-500">
                {item.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          Assignment distribution
        </span>
        <span className="text-xs text-slate-400">
          {total} total
        </span>
      </div>

      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
        {items.map((item) => (
          <div
            key={item.label}
            className={`${item.color} transition-all`}
            style={{ width: `${(item.value / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${item.color}`} />
            <span className="text-xs text-slate-500">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
