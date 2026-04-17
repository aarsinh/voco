import StatusPie from "./StatusPie";
import VolPerProject from "./VolProject";

function Dashboard() {
  return (
    <div className="p-6 md:p-10 text-slate-100">

      {/* Grid Layout: 1 column on mobile, 2 columns on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left: Pie Chart */}
        <div className="flex w-full">
          <StatusPie />
        </div>

        {/* Right: Line Chart */}
        <div className="flex w-full">
          <VolPerProject />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;