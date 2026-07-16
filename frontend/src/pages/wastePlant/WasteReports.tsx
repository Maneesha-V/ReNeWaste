import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { DatePicker, Button, Table } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  fetchWasteReports,
  filterWasteReports,
} from "../../redux/slices/wastePlant/wastePlantReportsSlice";
import { useAppDispatch } from "../../redux/hooks";
import { formatDateToDDMMYYYY } from "../../utils/formatDate";
import { PopWasteCollectionDTO } from "../../types/wasteCollections/wasteCollectionTypes";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const WasteReports = () => {
  const dispatch = useAppDispatch();
  const wasteData = useSelector(
    (state: RootState) => state.wastePlantReports.wasteReports,
  );
  const filteredData = useSelector(
    (state: RootState) => state.wastePlantReports.filterReports,
  );
  const [showFiltered, setShowFiltered] = useState(false);
  const today = dayjs().format("YYYY-MM-DD");
  const [fromDate, setFromDate] = useState<string | null>(today);
  const [toDate, setToDate] = useState<string | null>(today);
  const [showLineChart, setShowLineChart] = useState(false);

  useEffect(() => {
    dispatch(fetchWasteReports());
  }, [dispatch]);
  const handleFilter = async () => {
    if (fromDate && toDate) {
      console.log("dateRange", fromDate, toDate);
      dispatch(filterWasteReports({ from: fromDate, to: toDate }));
      setShowFiltered(true);
    }
  };
  const dataToUse = (showFiltered ? filteredData : wasteData) || [];
  console.log("dataToUse", dataToUse);

  const exportToCSV = () => {
    const formattedData = dataToUse.map((item: any) => ({
      Date: item.returnedAt ? formatDateToDDMMYYYY(item.returnedAt) : "N/A",
      "Waste Type": item.wasteType,
      Driver: item.driver?.name || "N/A",
      Truck: item.truck?.name || "N/A",
      "Measured Weight": item.measuredWeight,
      "Collected Weight": item.collectedWeight,
    }));

    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add heading as the first row (merged cell appearance is not supported here)
    const reportTitle = `Waste Report from ${fromDate} to ${toDate}`;
    XLSX.utils.sheet_add_aoa(worksheet, [[reportTitle]], { origin: "A1" });

    // Add an empty row (optional for spacing)
    XLSX.utils.sheet_add_aoa(worksheet, [[]], { origin: "A2" });

    // Add table headers and data starting from row 3
    XLSX.utils.sheet_add_json(worksheet, formattedData, {
      origin: "A3",
      skipHeader: false,
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "WasteReport");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "WasteReport.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `Waste Report from ${fromDate} to ${toDate}`;
    doc.setFontSize(14);
    doc.text(title, 14, 15);
    const tableColumn = [
      "Date",
      "Waste Type",
      "Driver",
      "Truck",
      "Measured Weight",
      "Collected Weight",
    ];
    const tableRows = dataToUse.map((item: PopWasteCollectionDTO) => [
      item.returnedAt ? formatDateToDDMMYYYY(item.returnedAt) : "N/A",
      item.wasteType,
      item.driver?.name || "N/A",
      item.truck?.name || "N/A",
      item.measuredWeight,
      item.collectedWeight,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
    doc.save("WasteReport.pdf");
  };

  const pieChartData = dataToUse.reduce((acc: any[], report: any) => {
    const type = report.wasteType;
    const weight = report.collectedWeight || 0;

    const existing = acc.find((item) => item.type === type);
    if (existing) {
      existing.weight += weight;
    } else {
      acc.push({ type, weight });
    }

    return acc;
  }, []);

  const lineChartData = dataToUse.reduce((acc: any[], report: any) => {
    const date = report.returnedAt
      ? formatDateToDDMMYYYY(report.returnedAt)
      : null;

    if (date) {
      const existing = acc.find((item) => item.date === date);
      if (existing) {
        existing.collectedWeight += report.collectedWeight || 0;
      } else {
        acc.push({
          date: date,
          collectedWeight: report.collectedWeight || 0,
        });
      }
    }

    return acc;
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "returnedAt",
      key: "returnedAt",
      render: (returnedAt: string) =>
        returnedAt ? formatDateToDDMMYYYY(returnedAt) : "N/A",
    },
    { title: "Waste Type", dataIndex: "wasteType", key: "wasteType" },
    {
      title: "Driver",
      dataIndex: ["driver", "name"],
      key: "name",
      render: (name: string) => name,
    },
    {
      title: "Truck",
      dataIndex: ["truck", "name"],
      key: "name",
      render: (name: string) => name,
    },
    {
      title: "Measured Weight",
      dataIndex: "measuredWeight",
      key: "measuredWeight",
      render: (weight: number) => `${weight} Kg`,
    },
    {
      title: "Collected Weight",
      dataIndex: "collectedWeight",
      key: "collectedWeight",
      render: (weight: number) => `${weight} Kg`,
    },
  ];

  return (
    <div className="bg-green-50 p-3 sm:p-6">
      <h2 className="text-center mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-green-700">
        Waste Reports
      </h2>

      {/* Date Filter + Actions */}

      <div className="mb-5 flex flex-col sm:flex-row flex-wrap gap-3 items-center justify-center">
        <div className="w-full sm:w-auto">
          <span style={{ marginRight: 5 }}>From:</span>
          <DatePicker className="w-full sm:w-48"
            onChange={(_, dateString) => {
              if (typeof dateString === "string") {
                setFromDate(dateString);
              }
            }}
          />
        </div>

        <div className="w-full sm:w-auto">
          <span style={{ marginRight: 5 }}>To:</span>
          <DatePicker className="w-full sm:w-48"
            onChange={(_, dateString) => {
              if (typeof dateString === "string") {
                setToDate(dateString);
              }
            }}
          />
        </div>

        <Button type="primary" onClick={handleFilter} className="w-full sm:w-auto">
          Filter
        </Button>

        <Button onClick={exportToCSV} className="w-full sm:w-auto">Export CSV</Button>
        <Button onClick={exportToPDF} className="w-full sm:w-auto">Export PDF</Button>
        <Button onClick={() => setShowLineChart(!showLineChart)} className="w-full sm:w-auto">
          {showLineChart ? "Show Pie Chart" : "Show Line Chart"}
        </Button>
      </div>

      {/* Chart Section */}

      <div className="flex justify-center mb-8">
        <div className="w-full max-w-5xl px-2 sm:px-4">
          {showLineChart ? (
            <>
              <h3 style={{ textAlign: "center" }}>
                Payment Trends (Line Chart)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={lineChartData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="collectedWeight"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <>
              <h3 className="text-center text-base sm:text-lg font-semibold mb-3">
                Payment Distribution (Pie Chart)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="weight"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    // outerRadius={100}
                    outerRadius={window.innerWidth < 640 ? 70 : 100}
                    fill="#8884d8"
                    label
                  >
                    {pieChartData.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][
                            index % 4
                          ]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto space-y-2">
        <Table
          scroll={{ x: "max-content" }}
          dataSource={dataToUse}
          columns={columns}
          rowKey="_id"
          bordered
          className="shadow-sm"
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default WasteReports;
