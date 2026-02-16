"use client";

import { useEffect, useState } from "react";

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

export default function GitHubActivity() {
  const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        // Take the last 364 days (52 weeks * 7 days)
        const last364 = allContributions.slice(-364);
        
        // Ensure we have exactly 364 days, pad with empty days if needed
        while (last364.length < 364) {
          last364.unshift({ date: "", count: 0, level: 0 });
        }

        setContributionData(last364.slice(0, 364));
        
        // Calculate total contributions for the displayed period
        const total = last364.slice(0, 364).reduce((acc, day) => acc + day.count, 0);
        setTotalContributions(total);
      } catch (error) {
        console.error("Error fetching GitHub contributions:", error);
        // Fallback to empty grid on error
        setContributionData(
          Array.from({ length: 364 }, () => ({ date: "", count: 0, level: 0 }))
        );
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  const getPromptColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-black";
      case 1:
        return "bg-green-700";
      case 2:
        return "bg-green-600";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-400";
      default:
        return "bg-black";
    }
  };

  const getMonthLabels = () => {
    // Return months from January to December
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  };

  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6 border-t border-neutral-200 pt-8">
        <h2 className="text-2xl font-serif font-medium text-neutral-900">
          Github Stats
        </h2>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-neutral-500 font-sans px-1">
          {getMonthLabels().map((month, i) => (
            <span key={i}>{month}</span>
          ))}
        </div>

        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <div className="grid grid-rows-[repeat(7,minmax(0,1fr))] grid-flow-col gap-0.5 min-w-fit">
            {loading
              ? Array.from({ length: 364 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm bg-black animate-pulse"
                  />
                ))
              : contributionData.map((day, i) => (
                  <div
                    key={i}
                    title={`${day.date}: ${day.count} contributions`}
                    className={`w-2.5 h-2.5 rounded-sm ${getPromptColor(day.level)}`}
                  />
                ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-sm text-neutral-600">
          <span>{totalContributions} contributions in {new Date().getFullYear()}</span>
          <div className="flex items-center gap-2 text-xs">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-black"></div>
              <div className="w-3 h-3 rounded-sm bg-green-700"></div>
              <div className="w-3 h-3 rounded-sm bg-green-600"></div>
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <div className="w-3 h-3 rounded-sm bg-green-400"></div>
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
