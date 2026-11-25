
import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

type MedicalRecord = {
  id: number;
  dogCode: string;
  diagnosis: string;
  treatment: string;
  examinedAt: string;
};

const records: MedicalRecord[] = [
  {
    id: 1,
    dogCode: "641025-001",
    diagnosis: "Minor wound on front leg",
    treatment: "Wound cleaning and antiseptic dressing",
    examinedAt: "Nov 10, 2026",
  },
  {
    id: 2,
    dogCode: "641025-002",
    diagnosis: "Skin infection",
    treatment: "Prescribed topical medication",
    examinedAt: "Nov 09, 2026",
  },
  {
    id: 3,
    dogCode: "641034-001",
    diagnosis: "Mild dehydration",
    treatment: "Fluid therapy and observation",
    examinedAt: "Nov 07, 2026",
  },
];

export default function RecentMedicalRecords() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent medical records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest examinations and treatment records.
          </p>
        </div>

        <Link
          to="/veterinarian/records"
          className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record.id}
            className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FileText size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">
                  {record.dogCode}
                </h3>
              </div>

              <p className="mt-1 text-sm font-medium text-slate-700">
                {record.diagnosis}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {record.treatment}
              </p>

              <span className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays size={13} />
                {record.examinedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
