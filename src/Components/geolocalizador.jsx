import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TbNetwork } from "react-icons/tb";
import { RiGlobalFill } from "react-icons/ri";
import { TbWorldLatitude } from "react-icons/tb";
import { TbWorldLongitude } from "react-icons/tb";

const GeoLocation = () => {
    const [ip, setIp] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const fetchLocationData = async () => {
        setLoading(true);
        try {

            const response = await axios.post(`https://upc-codex.tech:4261/API/V2/geoubicacion`, { ip: ip });
            setLocationData(response.data);
            setErrorMessage("")
        } catch (error) {
            console.error('Error fetching location data:', error);
            setErrorMessage(error)
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        setIp(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchLocationData();
    };

    return (
        <div data-theme="bumblebee" className="flex flex-col items-center justify-start w-full">
            <div className="w-full lg:p-6 p-4 bg-base-200 rounded-lg h-full flex flex-col shadow-md">
                <h1 className='text-center font-bold text-5xl my-5'>Geolocalización con IP</h1>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center gap-5'>
                    <input type="text" placeholder="Ingrese una dirección IP" className='inputB' value={ip} onChange={handleInputChange} />
                    {errorMessage != "" && (<p className='text-red-500  font-bold'>Ingrese una ip valida</p>)}
                    <button type="submit" className={`btn btn-secondary`} disabled={loading}>{loading ? 'Cargando...' : 'Buscar'}</button>
                </form>
                {locationData && (
                    <AnimatePresence mode='wait'>

                        <motion.div
                            key="location-details"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className=' flex justify-between gap-3  w-full items-start  mt-5'>
                                <div className='flex flex-col gap-2'>
                                    <p className='flex items-center gap-2'><TbNetwork />IP: {locationData.ip}</p>
                                    <p className='ml-6 flex items-center gap-2'>Proveedor de Servicios: {locationData.as}</p>
                                    <p className='ml-6 flex items-center gap-2'>¿Es un proxy?: {locationData.is_proxy ? 'Sí' : 'No'}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                <p className='flex items-center gap-2'><RiGlobalFill/>País: {locationData.country_name}</p>
                                <p className='ml-6 flex items-center gap-2'>Ciudad: {locationData.city_name}</p>
                                <p className='ml-6 flex items-center gap-2'>Región: {locationData.region_name}</p>

                                </div>
                                <div className='flex flex-col gap-2'>
                            <p className='flex items-center gap-2'><TbWorldLatitude/>Latitud: {locationData.latitude}</p>
                            <p className='flex items-center gap-2'><TbWorldLongitude/>Longitud: {locationData.longitude}</p>
                            <p className='ml-6 flex items-center gap-2'>Zona Horaria: {locationData.time_zone}</p>
                            <p className='ml-6 flex items-center gap-2'>ASN: {locationData.asn}</p>
                            </div>
                            </div>
                           
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default GeoLocation;
