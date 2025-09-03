import InventoryIcon from "@mui/icons-material/Inventory";
import Card from "../../components/Card";
import Example from "./Example";
import { useDashboard } from "../../context/DashboardContext";

const DashboardComponent = () => {
  const { dashboardData } = useDashboard();

  return (
    <div className="grid grid=cols-1 md:grid-cols-[4fr_8fr] gap-4">
      <div className="grid max-sm:grid-cols-2 sm:grid-cols-2 max-md:grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title={"Total Customers"}
          icon={<InventoryIcon />}
          desc={`${dashboardData.total_customers}`}
          extDesc={`customers`}
        />
        <Card
          title={"Sales Today"}
          icon={<InventoryIcon />}
          desc={`${Number(dashboardData.sales_today) > 0 ? "+" : ""} ${
            dashboardData.sales_today
          }%`}
          extDesc={`Since yesterday`}
        />
        <Card
          title={"Monthly Sales"}
          icon={<InventoryIcon />}
          desc={`${Number(dashboardData.monthly_sales) > 0 ? "+" : ""} ${
            dashboardData.monthly_sales
          }%`}
          extDesc={`Since Last Month`}
        />
        <Card
          title={"Yearly Sales"}
          icon={<InventoryIcon />}
          desc={`${Number(dashboardData.yearly_sales) > 0 ? "+" : ""} ${
            dashboardData.yearly_sales
          }%`}
          extDesc={`Since last year`}
        />
      </div>
      <div className="flex flex-col items-center bg-violet-100 p-5 rounded-lg h-full">
        <span className="m-2 pb-2 font-mono font-semibold">Monthly Report</span>
        <Example />
      </div>
    </div>
  );
};

export default DashboardComponent;
