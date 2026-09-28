import React from "react";

export const inputStyles =
  "w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400";

export function Field({ label, className = "", children }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}
      {children}
    </div>
  );
}

export function Input({ label, wrapperClassName, className = "", icon: Icon, ...props }) {
  return (
    <Field label={label} className={wrapperClassName}>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}
        <input className={`${inputStyles} ${Icon ? "pl-9" : ""} ${className}`} {...props} />
      </div>
    </Field>
  );
}

export function Select({ label, wrapperClassName, className = "", children, ...props }) {
  return (
    <Field label={label} className={wrapperClassName}>
      <select className={`${inputStyles} ${className}`} {...props}>
        {children}
      </select>
    </Field>
  );
}

const BUTTON_VARIANTS = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:opacity-95 disabled:opacity-60",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  danger: "text-rose-600 hover:bg-rose-50",
  ghost: "text-slate-500 hover:bg-slate-100",
};

const BUTTON_SIZES = {
  md: "px-5 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-xs",
};

export function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  return (
    <button
      className={`rounded-xl font-semibold transition disabled:cursor-not-allowed ${BUTTON_SIZES[size]} ${BUTTON_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({ icon: Icon, title, className = "" }) {
  return (
    <div className={`flex items-center gap-2 border-b border-slate-100 px-6 py-4 ${className}`}>
      {Icon && <Icon className="h-4 w-4 text-indigo-600" />}
      <h2 className="font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

export function PageHeader({ title, description }) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="mt-1 text-slate-500">{description}</p>}
    </div>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-400">
      {children}
    </div>
  );
}

const STATUS_STYLES = {
  paid: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  overdue: "bg-rose-50 text-rose-700",
};

export function StatusBadge({ status, icon: Icon, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}
