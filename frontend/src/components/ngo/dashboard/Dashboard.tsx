import StatusPie from "./StatusPie";
import VolPerProject from "./VolProject";
import ProjectRatingsBar from "./RateProject";
import TagDistributionRadar from "./TagDistribution"

function Dashboard() {
  return (
    <div className="p-6 md:p-10 text-slate-100">

      {/* The Grid: 1 column mobile, 2 columns desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* Top Left: Pie Chart */}
        <div className="flex w-full h-[350px]">
          <StatusPie />
        </div>

        {/* Top Right: Line Chart */}
        <div className="flex w-full h-[350px]">
          <VolPerProject />
        </div>

        {/* Bottom Row: Bar Chart (Spans both columns on desktop) */}
        <div className="flex w-full h-[350px]">
          <ProjectRatingsBar />
        </div>

        <div className="flex w-full h-[350px]">
          <TagDistributionRadar />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;