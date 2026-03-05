"use client";

import { useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

type Cell = { day: number; type: "prev" | "curr" | "next" };

function buildCalendarCells(year: number, month: number): Cell[][] {
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0=Sun
  const firstDayMon = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Cell[] = [];

  for (let i = firstDayMon - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, type: "prev" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, type: "curr" });
  }
  const rem = cells.length % 7;
  if (rem !== 0) {
    for (let d = 1; d <= 7 - rem; d++) {
      cells.push({ day: d, type: "next" });
    }
  }

  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function DemoCalendar(): React.ReactElement {
  const [viewDate, setViewDate] = useState(new Date(2024, 9, 1)); // October 2024
  const [selectedDay, setSelectedDay] = useState<number | null>(14);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const weeks = buildCalendarCells(year, month);

  const prevMonth = (): void => {
    setViewDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = (): void => {
    setViewDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  return (
    <div className="box-sizing-border w-full h-[300px] border-2 border-[#E5E7EB] rounded-[2px] overflow-hidden">
      <div className="px-[26px] pt-[26px]">

        {/* Month / year header */}
        <div className="flex justify-between items-center mb-[22px]">
          <span className="text-base font-bold text-black leading-6">
            {MONTHS[month]} {year}
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={prevMonth}
              className="hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Previous month"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 11L1 6L6 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Next month"
            >
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L1 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="text-center text-xs font-bold text-[#9CA3AF] leading-4">
              {d}
            </div>
          ))}
        </div>

        {/* Date rows */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((cell, ci) => {
              const isCurr = cell.type === "curr";
              const isSelected = isCurr && cell.day === selectedDay;

              return (
                <button
                  key={ci}
                  type="button"
                  disabled={!isCurr}
                  onClick={() => isCurr && setSelectedDay(cell.day)}
                  className="flex items-center justify-center py-[6px]"
                >
                  <span
                    className={`text-sm w-8 h-8 flex items-center justify-center rounded-full leading-5 transition-colors ${
                      isSelected
                        ? "bg-black text-white"
                        : isCurr
                        ? "text-black hover:bg-gray-100 cursor-pointer"
                        : "text-[#E5E7EB] cursor-default"
                    }`}
                  >
                    {cell.day}
                  </span>
                </button>
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
}
