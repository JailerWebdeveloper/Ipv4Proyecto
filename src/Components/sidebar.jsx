import { Link } from "react-router-dom";
import { RiGlobalFill } from "react-icons/ri";
import { LuNetwork } from "react-icons/lu";
import { TbNetwork } from "react-icons/tb";

const Sidebar = () => {
    return (<aside data-theme="" className="md:flex hidden flex-col md:w-64 w-32 min-h-full md:px-5 px-2  py-2 overflow-y-auto  ">
        <nav className="flex flex-col justify-start md:items-start items-center flex-wrap w-full gap-3 flex-1 ">
            <div className="my-3 flex flex-col gap-3 md:items-start items-center justify-start w-full">
                <label className="px-3 text-xs  uppercase ">Menu</label>

                <Link
                    to="/"
                    className="flex md:flex-row w-full p-2 transition-all flex-col items-center gap-4  md:rounded-lg hover:bg-green-500 hover:text-white "
                >
                    <LuNetwork className="w-auto h-6 " />

                    <p className="text-sm font-medium">Calculadora Ipv4</p>
                </Link>
                <Link
                    to="Ipv6"
                    className={`flex md:flex-row w-full p-2  flex-col items-center gap-4   md:rounded-lg hover:bg-green-500 hover:text-white transition-all `}
                >
                    <TbNetwork className="w-auto h-6 " />

                    <p className="text-sm font-medium break-all">Calculadora Ipv6</p>
                </Link>
                <Link
                    to="Geolocation"
                    className={`flex md:flex-row w-full p-2  flex-col items-center gap-4   md:rounded-lg hover:bg-green-500 hover:text-white transition-all `}
                >
                    <RiGlobalFill className="w-auto h-6 " />

                    <p className="text-sm font-medium break-all">GeoLocalizador</p>
                </Link>



            </div>
        </nav>
    </aside>);
}

export default Sidebar;