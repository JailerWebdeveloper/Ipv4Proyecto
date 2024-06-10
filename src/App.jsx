import Ipv4Modal from "./Components/ipv4Modal"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css"
import Ipv6Modal from "./Components/ipv6Modal";
import Ipv4bits from "./Components/Ipv4Bits";
import GeoLocation from "./Components/geolocalizador"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Dashboard />} >
        <Route path="" element={<Ipv4Modal />} />
        <Route path="Ipv6" element={<Ipv6Modal />} />
        <Route path="Ipv4bit" element={<Ipv4bits />} />
        <Route path="Geolocation" element={<GeoLocation />} />

        </Route>
        

      </Routes>
    </BrowserRouter>
  )
}

export default App
