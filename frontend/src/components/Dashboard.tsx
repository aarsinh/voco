import React from 'react';
import ShowProjectList from './ShowProjList';
import ShowRegisteredList from './RegisteredProjList'; // We will rename your file to match this

function Dashboard() {
    return (
        <div className="container-fluid" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="row p-4">
                {/* Left Side: Registered Projects */}
                <div className="col-lg-6 col-md-12 mb-4">
                    <ShowRegisteredList />
                </div>

                {/* Right Side: Available Projects */}
                <div className="col-lg-6 col-md-12 mb-4">
                    <ShowProjectList />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;