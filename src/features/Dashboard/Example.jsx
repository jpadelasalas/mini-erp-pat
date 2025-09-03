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
import { useDashboard } from "../../context/DashboardContext";

const Example = () => {
  const { salesData, yearReport } = useDashboard();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={salesData}
        margin={{
          top: 0,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey={yearReport.thisYear} fill="#8884d8" />
        <Bar yAxisId="right" dataKey={yearReport.lastYear} fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Example;
