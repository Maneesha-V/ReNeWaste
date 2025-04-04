const DashboardContent = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-green-100">
          <h3 className="font-medium text-green-700">Total Waste Collected</h3>
          <p className="text-3xl font-bold mt-2">1,245 kg</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-green-100">
          <h3 className="font-medium text-green-700">Active Plants</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-green-100">
          <h3 className="font-medium text-green-700">Monthly Revenue</h3>
          <p className="text-3xl font-bold mt-2">$12,450</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;