import StatusPie from "./StatusPie";
import VolPerProject from "./VolProject";
import ProjectRatingsBar from "./RateProject";
import TagDistributionRadar from "./TagDistribution"
import TopProjectsList from "./TopProj";

function Dashboard() {
  return (
    <div className="p-6 md:p-10 text-primary">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        <div className="flex w-full h-[350px]">
          <StatusPie />
        </div>

        <div className="flex w-full h-[350px]">
          <TagDistributionRadar />
        </div>

        <div className="flex w-full h-[350px]">
          <ProjectRatingsBar />
        </div>

        <div className="flex w-full h-[350px]">
          <TopProjectsList />
        </div>

        <div className="flex w-full h-[350px] lg:col-span-2">
          <VolPerProject />
        </div>

      </div>
    </div>
  );
}

export default Dashboard;