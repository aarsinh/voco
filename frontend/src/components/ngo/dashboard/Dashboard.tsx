import StatusPie from "./StatusPie";
import VolPerProject from "./VolProject";
import ProjectRatingsBar from "./RateProject";

function Dashboard() {
  return (
    <div className="p-6 md:p-10 text-slate-100">
      <h1 className="text-2xl font-semibold mb-8">NGO Dashboard</h1>

      {/* The Grid: 1 column mobile, 2 columns desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Top Left: Pie Chart */}
        <div className="flex w-full h-[350px]">
          <StatusPie />
        </div>

        {/* Top Right: Line Chart */}
        <div className="flex w-full h-[350px]">
          <ProjectRatingsBar />
        </div>

        {/* Bottom Row: Bar Chart (Spans both columns on desktop) */}
        <div className="flex w-full h-[350px] lg:col-span-2">
          <VolPerProject />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;