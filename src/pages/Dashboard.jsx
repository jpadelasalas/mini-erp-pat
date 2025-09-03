import { DashboardContextProvider } from "../context/DashboardContext";
import DashboardComponent from "../features/Dashboard/DashboardComponent";

const Dashboard = () => {
  return (
    <DashboardContextProvider>
      <DashboardComponent />
    </DashboardContextProvider>
  );
};

export default Dashboard;
