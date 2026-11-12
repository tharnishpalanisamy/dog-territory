
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  ArrowRight,
  HeartPulse,
  Truck,
  Syringe,
  Utensils,
} from "lucide-react";

type Task = {
  id: number;
  title: string;
  description: string;
  area: string;
  taskType: string;
  priority: "low" | "normal" | "high" | "urgent";
};

const tasks: Task[] = [
  {
    id: 1,
    title: "Rescue injured street dog",
    description: "A dog needs assistance and transportation to a veterinary clinic.",
    area: "Coimbatore North",
    taskType: "rescue",
    priority: "urgent",
  },
  {
    id: 2,
    title: "Vaccination assistance",
    description: "Help coordinate a vaccination visit for a street dog.",
    area: "Edayarpalayam",
    taskType: "vaccination",
    priority: "high",
  },
  {
    id: 3,
    title: "Food and water support",
    description: "Provide food and clean drinking water to nearby street dogs.",
    area: "Thudiyalur",
    taskType: "feeding",
    priority: "normal",
  },
];

const taskIcons: Record<string, typeof HeartPulse> = {
  rescue: HeartPulse,
  transport: Truck,
  vaccination: Syringe,
  feeding: Utensils,
};

const priorityStyles = {
  low: "bg-slate-100 text-slate-600",
  normal: "bg-blue-50 text-blue-600",
  high: "bg-amber-50 text-amber-700",
  urgent: "bg-rose-50 text-rose-600",
};

export default function AvailableTasks() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Available tasks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Open assignments waiting for volunteers.
          </p>
        </div>

        <Link
          to="/volunteer/tasks"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => {
          const Icon = taskIcons[task.taskType] ?? HeartPulse;

          return (
            <div
              key={task.id}
              className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {task.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${priorityStyles[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {task.description}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                  <MapPin size={13} />
                  {task.area}
                  <span className="mx-1">·</span>
                  <Clock size={13} />
                  Open assignment
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
