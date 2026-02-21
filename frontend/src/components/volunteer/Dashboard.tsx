import ShowProjectList from './ShowProjList';
import ShowRegisteredList from './RegisteredProjList';

function Dashboard() {
    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

                <div className="w-full">
                    <ShowRegisteredList />
                </div>

                <div className="w-full">
                    <ShowProjectList />
                </div>

            </div>
        </div>
    );
}

export default Dashboard;