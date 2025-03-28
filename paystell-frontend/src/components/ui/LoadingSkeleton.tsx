"use client";

interface SkeletonProps {
  type?: "card" | "table" | "chart";
  rows?: number;
  height?: string;
  width?: number | string;
  count?: number;
}

const LoadingSkeleton: React.FC<SkeletonProps> = ({
  type = "card",
  rows = 3,
  height,
  width = "100%",
}) => {
  const baseStyle = "rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse";
  switch (type) {
    case "card":
      return (
        <div
          className={`${baseStyle} p-4`}
          style={{ height: height || 150, width }}
        >
          <div className="h-4 w-3/5 rounded bg-gray-300 dark:bg-gray-600 mb-2"></div>
          <div className="h-6 w-4/5 rounded bg-gray-300 dark:bg-gray-600 mb-2"></div>
          <div className="h-4 w-2/5 rounded bg-gray-300 dark:bg-gray-600"></div>
        </div>
      );

    case "table":
      return (
        <div
          className="gap-y-4 animate-pulse flex flex-col p-4 bg-gray-200 dark:bg-gray-700 rounded-md"
          style={{ width }}
        >
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex gap-x-4 w-full">
              <div className="w-1/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-1/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-1/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="w-1/4 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      );

    case "chart":
      return (
        <div className="flex items-end space-x-2 w-full h-40 animate-pulse">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-6 bg-gray-300 dark:bg-gray-600 rounded"
              style={{ height: `${Math.random() * 100 + 50}px` }}
            ></div>
          ))}
        </div>
      );
  }
};

export default LoadingSkeleton;