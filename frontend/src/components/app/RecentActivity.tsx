
import {
  Activity,
  MessageSquare,
  AlertCircle,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

export type AssignmentActivity = {
  id: number;
  updateType: "progress" | "note" | "issue" | "location";
  description: string;
  assignmentTitle: string;
  updatedBy: string;
  createdAt: string;
};

type Props = {
  activities: AssignmentActivity[];
  title?: string;
  subtitle?: string;
};

const activityConfig = {
  progress: {
    label: "Progress update",
    icon: Activity,
    style: "bg-emerald-50 text-emerald-600",
  },
  note: {
    label: "Note added",
    icon: MessageSquare,
    style: "bg-indigo-50 text-indigo-600",
  },
  issue: {
    label: "Issue reported",
    icon: AlertCircle,
    style: "bg-rose-50 text-rose-600",
  },
  location: {
    label: "Location update",
    icon: MapPin,
    style: "bg-sky-50 text-sky-600",
  },
};

export default function RecentActivity({
  activities,
  title = "Recent activity",
  subtitle = "Latest updates from field assignments.",
}: Props) {

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-900">
            {title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
            {subtitle}
        </p>
    </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center">
          <Activity className="mx-auto mb-2 text-slate-300" size={28} />
          <p className="text-sm font-medium text-slate-600">
            No recent activity
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Assignment updates will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {activities.map((activity) => {
            const config = activityConfig[activity.updateType];
            const Icon = config.icon;

            return (
              <div key={activity.id} className="flex gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.style}`}
                >
                  <Icon size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900">
                      {config.label}
                    </span>

                    <span className="text-xs text-slate-400">
                      {activity.createdAt}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {activity.description}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {activity.updatedBy} · {activity.assignmentTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
