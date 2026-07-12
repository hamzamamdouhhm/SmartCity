import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const DEFAULT_COLORS = ["cat-1", "cat-2", "cat-3", "cat-4", "cat-5"];

export const BarChart = ({ labels, datasets, height = 200, yMax = 100 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Resolve Tailwind colors to CSS values
  const resolveColor = (token) => {
    if (typeof window === "undefined") return token;
    if (token.startsWith("#") || token.startsWith("rgb") || token.startsWith("hsl")) return token;
    const map = {
      "cat-1": "--color-cat-1",
      "cat-2": "--color-cat-2",
      "cat-3": "--color-cat-3",
      "cat-4": "--color-cat-4",
      "cat-5": "--color-cat-5",
    };
    const cssVar = map[token];
    if (cssVar) {
      const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
      if (value) return `hsl(${value})`;
    }
    return token;
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");

    // Destroy previous chart
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const isDark = document.documentElement.classList.contains("dark");
    const gridColor = isDark ? "hsl(var(--color-border-strong))" : "hsl(var(--color-border))";
    const textColor = "hsl(var(--color-text-tertiary))";

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          ...ds,
          backgroundColor: ds.backgroundColor
            ? resolveColor(ds.backgroundColor)
            : resolveColor(DEFAULT_COLORS[i % DEFAULT_COLORS.length]),
          borderRadius: 6,
          borderSkipped: false,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
              font: { family: "Inter, system-ui, sans-serif", size: 12 },
            },
          },
          tooltip: {
            backgroundColor: "hsl(var(--color-surface-elevated))",
            titleColor: "hsl(var(--color-text-primary))",
            bodyColor: "hsl(var(--color-text-secondary))",
            borderColor: "hsl(var(--color-border))",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: yMax,
            grid: { color: gridColor, drawBorder: false },
            ticks: { color: textColor, font: { family: "IBM Plex Mono, ui-monospace, monospace" } },
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { family: "Inter, system-ui, sans-serif", size: 12 } },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [labels, datasets, yMax]);

  return <canvas ref={canvasRef} style={{ height, width: "100%" }} />;
};
