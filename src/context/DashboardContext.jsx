import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DashboardContext = createContext();

export const DashboardContextProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    total_customers: 0,
    sales_today: 0,
    monthly_sales: 0,
    yearly_sales: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [yearReport, setYearReport] = useState({
    thisYear: "",
    lastYear: "",
  });

  const getLocalData = useCallback((key, defaultVal = {}) => {
    try {
      return JSON.parse(
        localStorage.getItem(key) || JSON.stringify(defaultVal)
      );
    } catch {
      return defaultVal;
    }
  }, []);

  const getUserId = () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      return user?.id || null;
    } catch {
      return null;
    }
  };

  const now = new Date();

  const today = () => new Date().toISOString().split("T")[0];

  const yesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const currentMonth = now.getMonth();

  const currentYear = now.getFullYear();

  const totalPriceSum = (obj) => {
    return obj
      ? Object.values(obj).reduce((acc, val) => {
          return acc + val.total_price;
        }, 0)
      : 0;
  };

  const getPercentageChange = (current, previous) => {
    if (previous === 0 && current === 0) return 0;
    if (previous === 0) return 100;
    return (((current - previous) / previous) * 100).toFixed(2);
  };

  const getSalesByMonthYear = useCallback((sales, month, year) => {
    let total = 0;
    for (const date in sales) {
      const d = new Date(date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        total += totalPriceSum(sales[date]);
      }
    }
    return total;
  }, []);

  const getSalesByYear = useCallback((sales, year) => {
    let total = 0;
    for (const date in sales) {
      const d = new Date(date);
      if (d.getFullYear() === year) {
        total += totalPriceSum(sales[date]);
      }
    }
    return total;
  }, []);

  const generateMonthlyData = useCallback(
    (sales) => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const data = months.map((month, index) => ({
        name: month,
        [`yr${currentYear - 1}`]:
          getSalesByMonthYear(sales, index, currentYear - 1) || 0,
        [`yr${currentYear}`]:
          getSalesByMonthYear(sales, index, currentYear) || 0,
      }));

      months.map((month, index) => {
        console.log(
          month,
          getSalesByMonthYear(sales, index, currentYear),
          getSalesByMonthYear(sales, index, currentYear - 1),
          index,
          currentYear
        );
      });

      return data;
    },
    [getSalesByMonthYear, currentYear]
  );

  useEffect(() => {
    const data = getLocalData("Sales");
    const userId = getUserId();

    if (data && data[userId]) {
      const sales = {};

      data[userId].forEach((item) => {
        const dateKey = item.sold_at.split("T")[0];
        if (!sales[dateKey]) sales[dateKey] = [];
        sales[dateKey].push(item);
      });

      const salesToday = totalPriceSum(sales[today()]);
      const salesYesterday = totalPriceSum(sales[yesterday()]);

      const thisMonthSales = getSalesByMonthYear(
        sales,
        currentMonth,
        currentYear
      );
      const lastMonthSales = getSalesByMonthYear(
        sales,
        currentMonth - 1,
        currentYear
      );

      const thisYearSales = getSalesByYear(sales, currentYear);
      const lastYearSales = getSalesByYear(sales, currentYear - 1);

      const dailyChange = getPercentageChange(salesToday, salesYesterday);
      const monthlyChange = getPercentageChange(thisMonthSales, lastMonthSales);
      const yearlyChange = getPercentageChange(thisYearSales, lastYearSales);

      const customersNum = new Set(
        data[userId].map((item) => item.customer_name)
      ).size;

      setSalesData(generateMonthlyData(sales));
      setYearReport({
        thisYear: `yr${currentYear}`,
        lastYear: `yr${currentYear - 1}`,
      });

      setDashboardData({
        total_customers: customersNum,
        sales_today: dailyChange,
        monthly_sales: monthlyChange,
        yearly_sales: yearlyChange,
      });
    }
  }, [
    getLocalData,
    getSalesByMonthYear,
    getSalesByYear,
    generateMonthlyData,
    currentMonth,
    currentYear,
  ]);

  return (
    <DashboardContext.Provider value={{ dashboardData, salesData, yearReport }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
