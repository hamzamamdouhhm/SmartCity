import React from "react";

export const DataTable = ({ children, className = "" }) => (
  <div className={`overflow-x-auto rounded-lg border border-border bg-surface shadow-sm ${className}`}>
    <table className="w-full min-w-[640px] text-sm">{children}</table>
  </div>
);

export const DataTableHead = ({ children }) => (
  <thead className="bg-subtle border-b border-border">
    <tr>{children}</tr>
  </thead>
);

export const DataTableBody = ({ children }) => <tbody className="divide-y divide-border">{children}</tbody>;

export const DataTableHeader = ({ children, className = "" }) => (
  <th className={`text-left px-4 py-3 font-semibold text-text-primary whitespace-nowrap ${className}`}>
    {children}
  </th>
);

export const DataTableCell = ({ children, className = "" }) => (
  <td className={`px-4 py-3 align-top text-text-secondary ${className}`}>{children}</td>
);

export const DataTableRow = ({ children, className = "" }) => (
  <tr className={`transition-colors hover:bg-subtle/50 ${className}`}>{children}</tr>
);
