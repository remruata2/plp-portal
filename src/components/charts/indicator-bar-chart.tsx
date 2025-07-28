"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChartData {
  name: string;
  actual: number;
  target: number;
  achievement: number;
}

interface IndicatorBarChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  height?: number;
  showAchievement?: boolean;
}

export default function IndicatorBarChart({
  title,
  description,
  data,
  height = 300,
  showAchievement = true,
}: IndicatorBarChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === "actual" && "Actual: "}
              {entry.dataKey === "target" && "Target: "}
              {entry.dataKey === "achievement" && "Achievement: "}
              {entry.value}
              {entry.dataKey === "achievement" && "%"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="actual"
              fill="#3b82f6"
              name="Actual"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="target"
              fill="#e5e7eb"
              name="Target"
              radius={[2, 2, 0, 0]}
            />
            {showAchievement && (
              <Bar
                dataKey="achievement"
                fill="#10b981"
                name="Achievement %"
                radius={[2, 2, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// District Performance Chart Component
interface DistrictPerformanceProps {
  data: {
    district: string;
    indicators: {
      [key: string]: {
        actual: number;
        target: number;
        achievement: number;
      };
    };
  }[];
  selectedIndicator: string;
}

export function DistrictPerformanceChart({
  data,
  selectedIndicator,
}: DistrictPerformanceProps) {
  const chartData = data.map((district) => ({
    name: district.district,
    actual: district.indicators[selectedIndicator]?.actual || 0,
    target: district.indicators[selectedIndicator]?.target || 0,
    achievement: district.indicators[selectedIndicator]?.achievement || 0,
  }));

  return (
    <IndicatorBarChart
      title={`${selectedIndicator} - District Performance`}
      description="Performance comparison across all districts"
      data={chartData}
      height={400}
    />
  );
}

// Indicator Comparison Chart Component
interface IndicatorComparisonProps {
  data: {
    indicator: string;
    actual: number;
    target: number;
    achievement: number;
  }[];
}

export function IndicatorComparisonChart({ data }: IndicatorComparisonProps) {
  const chartData = data.map((item) => ({
    name:
      item.indicator.length > 15
        ? item.indicator.substring(0, 15) + "..."
        : item.indicator,
    actual: item.actual,
    target: item.target,
    achievement: item.achievement,
  }));

  return (
    <IndicatorBarChart
      title="All Indicators Overview"
      description="State-level performance across all health indicators"
      data={chartData}
      height={500}
    />
  );
}
