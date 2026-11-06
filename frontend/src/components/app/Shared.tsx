import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <div className="page-eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-heading-action">{action}</div>}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  const kind = status.toLowerCase().replace(/[^a-z]+/g, "-");
  return <span className={`status-badge status-${kind}`}>{status.replaceAll("-", " ")}</span>;
}

export function Avatar({ name, size = "normal" }: { name: string; size?: "normal" | "large" }) {
  return <span className={`avatar avatar-${size}`} aria-label={name}>{name}</span>;
}

export function StatCard({ label, value, icon, footnote }: { label: string; value: string; icon: string; footnote?: string }) {
  return <article className="stat-card"><span className="stat-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong>{footnote && <span className="stat-footnote">{footnote}</span>}</div></article>;
}

export function EmptyState({ icon, title, description, action }: { icon: string; title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><span>{icon}</span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function Pagination({ current = 1, total = 4 }: { current?: number; total?: number }) {
  return <div className="pagination"><span>Showing 1–6 of 24 entries</span><div><button aria-label="Previous page" disabled>‹</button>{Array.from({ length: total }, (_, i) => <button key={i} className={i + 1 === current ? "current" : ""}>{i + 1}</button>)}<button aria-label="Next page">›</button></div></div>;
}

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`field ${className}`}><span>{label}</span>{children}</label>;
}

export function TextField({ label, placeholder, type = "text", defaultValue, className = "" }: { label: string; placeholder?: string; type?: string; defaultValue?: string | number; className?: string }) {
  return <Field label={label} className={className}><input type={type} placeholder={placeholder} defaultValue={defaultValue} /></Field>;
}

export function SelectField({ label, options }: { label: string; options: string[] }) {
  return <Field label={label}><select defaultValue=""><option value="">All {label.toLowerCase()}</option>{options.map((option) => <option key={option}>{option}</option>)}</select></Field>;
}

export function BackLink({ to, children = "Back to list" }: { to: string; children?: ReactNode }) {
  return <Link className="back-link" to={to}>← <span>{children}</span></Link>;
}

export function ImageUpload({ multiple = false }: { multiple?: boolean }) {
  return <label className="upload-zone"><input type="file" accept="image/*" multiple={multiple} /><span className="upload-icon">↑</span><strong>Choose {multiple ? "images" : "an image"} to preview</strong><small>JPG, PNG or WEBP</small></label>;
}
