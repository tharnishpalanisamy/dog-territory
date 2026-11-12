
import { Link } from "react-router-dom";
import {
  Syringe,
  Pill,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

type CareItem = {
  id: number;
  dogCode: string;
  title: string;
  type: "vaccination" | "treatment";
  scheduledDate: string;
  area: string;
};

const careItems: CareItem[] = [
  {
    id: 1,
    dogCode: "641025-001",
    title: "Anti-rabies vaccination",
    type: "vaccination",
    scheduledDate: "Nov 14, 2026",
    area: "Edayarpalayam",
  },
  {
    id: 2,
    dogCode: "641025-002",
    title: "Skin infection follow-up",
    type: "treatment",
    scheduledDate: "Nov 15, 2026",
    area: "TVS Nagar",
  },
  {
    id: 3,
    dogCode: "641034-001",
    title: "Deworming",
    type: "treatment",
    scheduledDate: "Nov 16, 2026",
    area: "Thudiyalur",
  },
];

export default function UpcomingCare() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Upcoming care
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Scheduled treatments and vaccinations.
          </p>
        </div>

        <Link
          to="/veterinarian/treatments"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {careItems.map((item) => {
          const isVaccination = item.type === "vaccination";
          const Icon = isVaccination ? Syringe : Pill;

          return (
            <div
              key={item.id}
              className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  isVaccination
                    ? "bg-sky-50 text-sky-600"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <Icon size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isVaccination
                        ? "bg-sky-50 text-sky-700"
                        : "bg-indigo-50 text-indigo-700"
                    }`}
                  >
                    {isVaccination ? "Vaccination" : "Treatment"}
                  </span>
                </div>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {item.dogCode}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} />
                    {item.scheduledDate}
                  </span>

                  <span>{item.area}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
