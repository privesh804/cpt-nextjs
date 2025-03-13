import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import budgetServices from "@/services/budget";
import { PuffLoader } from "react-spinners";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const BudgetExpansesCard = () => {
  const [trackingData, setTrackingData] = useState<ExpenseTrackData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { projectId } = useSelector((state: RootState) => state.project);
  const budgetExpenseTracking = async () => {
    try {
      setLoading(true);
      if (projectId) {
        let res = await budgetServices.getBudgeTracking({ projectId });

        if (res && res.status === 200 && Array.isArray(res.data?.data)) {
          setLoading(false);
          setTrackingData(res.data.data);
        } else {
          setTrackingData([]);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    budgetExpenseTracking();
  }, [projectId]);

  // const daysData = trackingData.map((item) => item.days);
  // const budgetLabels = trackingData.map((item) => item.budget);

  type ChartData = {
    series: { name: string; type: string; data: number[] }[];
    options: ApexOptions;
  };

  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    options: {} as ApexOptions,
  });

  useEffect(() => {
    if (trackingData.length > 0) {
      setChartData({
        series: [
          {
            name: "Budget",
            type: "area",
            data: trackingData.map((item) => parseFloat(item.budget)), // Set budget as Y-axis values
          },
        ],
        options: {
          chart: {
            height: 350,
            type: "line",
            toolbar: {
              show: false, // Hide the toolbar
            },
          },
          fill: {
            type: "solid",
            colors: ["#4CAD6D"],
            opacity: [0.35, 1],
          },
          labels: trackingData.map((item) => item.days.toString()), // Set days as X-axis labels
          markers: {
            size: 5,
          },
          yaxis: [
            {
              title: {
                text: "Budget ($)",
              },
            },
          ],
          xaxis: {
            title: {
              text: "Days",
            },
          },
          tooltip: {
            shared: true,
            intersect: false,
            y: {
              formatter: function (y) {
                return typeof y !== "undefined" ? `$${y.toFixed(2)}` : y;
              },
            },
          },
        },
      });
    }
  }, [trackingData]);

  return (
    <div>
      <div id="chart" className="w-full overflow-hidden relative">
        {loading ? (
          <p className="flex align-center justify-center">
            <PuffLoader />
          </p>
        ) : (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="line"
            height={350}
          />
        )}
      </div>
    </div>
  );
};

export default BudgetExpansesCard;
