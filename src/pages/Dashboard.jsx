import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/sidebar";



const Dashboard = () => {
    return (<div className="bg-base overflow-y-auto w-full min-h-screen antialiased text-slate-900 selection:bg-blue-900 selection:text-white">
        <div className="flex flex-col relative w-full h-full">
            <Navbar  />
            <div className="flex flex-row relative w-full h-full ">
                <Sidebar />
                <div className="flex-1 h-full md:p-4 p-1 overflow-y-auto w-full ">
                    <div className="w-full h-full rounded-lg ">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default Dashboard;