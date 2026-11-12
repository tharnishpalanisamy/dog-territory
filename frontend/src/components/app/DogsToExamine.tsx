
import { Link } from "react-router-dom";
import {
  Dog,
  MapPin,
  ArrowRight,
  Stethoscope,
} from "lucide-react";

type ExaminationDog = {
  id: number;
  dogCode: string;
  issue: string;
  area: string;
  priority: "urgent" | "high" | "normal";
  status: "pending" | "scheduled";
};

const dogs: ExaminationDog[] = [
  {
    id: 1,
    dogCode: "641025-001",
    issue: "Visible injury on front leg",
    area: "Edayarpalayam",
    priority: "urgent",
    status: "pending",
  },
  {
    id: 2,
    dogCode: "641025-002",
    issue: "Suspected skin infection",
    area: "TVS Nagar",
    priority: "high",
    status: "pending",
  },
  {
    id: 3,
    dogCode: "641034-001",
    issue: "Routine health examination",
    area: "Thudiyalur",
    priority: "normal",
    status: "scheduled",
  },
];

const priorityStyles = {
  urgent: "bg-rose-50 text-rose-600",
  high: "bg-amber-50 text-amber-700",
  normal: "bg-blue-50 text-blue-600",
};

export default function DogsToExamine() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Dogs requiring examination
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Patients awaiting veterinary attention.
          </p>
        </div>

        <Link
          to="/veterinarian/dogs"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {dogs.map((dog) => (
          <div
            key={dog.id}
            className="flex items-start gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Dog size={21} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {dog.dogCode}
                </h3>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${priorityStyles[dog.priority]}`}
                >
                  {dog.priority}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-600">
                {dog.issue}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {dog.area}
                </span>

                <span className="flex items-center gap-1">
                  <Stethoscope size={13} />
                  {dog.status === "pending" ? "Pending examination" : "Scheduled"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
