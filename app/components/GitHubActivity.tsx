"use client";

import { useEffect, useRef, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: {
    [year: string]: number;
  };
  contributions: Array<ContributionDay>;
}

const DAYS = 365;

function toKey(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** The last 365 calendar days, oldest first, ending today (local time). */
function buildYear() {
  const today = new Date();
  return Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (DAYS - 1 - i));
    return toKey(d);
  });
}

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export default function GitHubActivity() {
  const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [shouldFetch, setShouldFetch] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (shouldFetch) return;

    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [shouldFetch]);

  useEffect(() => {
    if (!shouldFetch) return;

    async function fetchContributions() {
      try {
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;
        
        // Fetch data for both current year and last year to get full 12 months
        const [currentYearResponse, lastYearResponse] = await Promise.all([
          fetch(`https://github-contributions-api.jogruber.de/v4/lafatha?y=${currentYear}`),
          fetch(`https://github-contributions-api.jogruber.de/v4/lafatha?y=${lastYear}`),
        ]);

        let allContributions: ContributionDay[] = [];

        // Process last year data first
        if (lastYearResponse.ok) {
          const lastYearData: ContributionData = await lastYearResponse.json();
          allContributions = [...lastYearData.contributions];
        }

        // Process current year data
        if (currentYearResponse.ok) {
          const currentYearData: ContributionData = await currentYearResponse.json();
          allContributions = [...allContributions, ...currentYearData.contributions];
        }

        // If we still don't have data, try the 'last' endpoint as fallback
        if (allContributions.length === 0) {
          const fallbackResponse = await fetch(
            "https://github-contributions-api.jogruber.de/v4/lafatha?y=last"
          );
          if (fallbackResponse.ok) {
            const fallbackData: ContributionData = await fallbackResponse.json();
            allContributions = fallbackData.contributions;
          }
        }

        const byDate = new Map(allContributions.map((d) => [d.date, d]));
        const year = buildYear().map((date) => byDate.get(date) ?? { date, count: 0, level: 0 });
        setContributionData(year);
        setTotalContributions(year.reduce((acc, day) => acc + day.count, 0));
      } catch (error) {
        console.error("Error fetching GitHub contributions:", error);
        // Fallback to empty grid on error
        setContributionData(buildYear().map((date) => ({ date, count: 0, level: 0 })));
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, [shouldFetch]);

  const days = buildYear();
  const cells = loading || contributionData.length === 0
    ? days.map((date) => ({ date, count: 0, level: 0 }))
    : contributionData;
  const lead = parseKey(days[0]).getDay(); // empty slots so day 1 sits on its weekday row
  const weeks = Math.ceil((lead + DAYS) / 7);

  const getPromptColor = (level: number) => {
    switch (level) {
      case 0:
        return "gh-dot-empty";
      case 1:
        return "bg-green-700";
      case 2:
        return "bg-green-600";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-400";
      default:
        return "gh-dot-empty";
    }
  };

  return (
    <section ref={sectionRef} className="mb-16">
      <div className="flex items-center gap-2 mb-6 border-t border-line pt-8">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">
          Github Stats
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <div className="min-w-[520px]">
            <div
              className="grid grid-flow-col gap-[3px]"
              style={{
                gridTemplateRows: "repeat(7, auto)",
                gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: lead }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square" />
              ))}
              {cells.map((day, i) => (
                <div
                  key={day.date || i}
                  title={loading ? undefined : `${day.date}: ${day.count} contributions`}
                  className={`aspect-square ${loading ? "gh-dot-empty animate-pulse" : getPromptColor(day.level)}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-sm text-neutral-600">
          <span>{totalContributions} contributions in the last year</span>
          <div className="flex items-center gap-2 text-xs">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 gh-dot-empty"></div>
              <div className="w-3 h-3 bg-green-700"></div>
              <div className="w-3 h-3 bg-green-600"></div>
              <div className="w-3 h-3 bg-green-500"></div>
              <div className="w-3 h-3 bg-green-400"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
