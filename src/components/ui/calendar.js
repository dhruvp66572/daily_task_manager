"use client";
import { useState } from "react";

export function Calendar({ selected, onSelect }) {
  const [date, setDate] = useState(selected);

  return (
    <input
      type="date"
      value={date.toISOString().substring(0, 10)}
      onChange={(e) => {
        const newDate = new Date(e.target.value);
        setDate(newDate);
        onSelect(newDate);
      }}
      className="p-2 border rounded w-full"
    />
  );
}
