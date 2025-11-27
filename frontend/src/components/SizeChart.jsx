import React from "react";

export default function SizeChart({ sizes }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className="mt-2 text-xs text-gray-700">
      <table className="w-full border border-gray-200 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 border">Label</th>
            <th className="px-2 py-1 border">US</th>
            <th className="px-2 py-1 border">UK</th>
            <th className="px-2 py-1 border">EU</th>
            <th className="px-2 py-1 border">AU</th>
            <th className="px-2 py-1 border">JP</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((s) => (
            <tr key={s.sizeLabel}>
              <td className="px-2 py-1 border">{s.sizeLabel}</td>
              <td className="px-2 py-1 border">{s.countrySizes?.US || "-"}</td>
              <td className="px-2 py-1 border">{s.countrySizes?.UK || "-"}</td>
              <td className="px-2 py-1 border">{s.countrySizes?.EU || "-"}</td>
              <td className="px-2 py-1 border">{s.countrySizes?.AU || "-"}</td>
              <td className="px-2 py-1 border">{s.countrySizes?.JP || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
