import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const GeoLocation = () => {
    const [ip, setIp] = useState('');
    const [locationData, setLocationData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchLocationData = async () => {
        setLoading(true);
        try {

            const response = await axios.post(`https://upc-codex.tech:4261/API/V2/geoubicacion`,{ip:ip});
            setLocationData(response.data);
        } catch (error) {
            console.error('Error fetching location data:', error);
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
        <div className="container">
            <h1>Geolocalización con IP</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Ingrese una dirección IP" value={ip} onChange={handleInputChange} />
                <button type="submit" disabled={loading}>{loading ? 'Cargando...' : 'Buscar'}</button>
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
                        <p>IP: {locationData.ip}</p>
                        <p>País: {locationData.country_name}</p>
                        <p>Ciudad: {locationData.city_name}</p>
                        <p>Región: {locationData.region_name}</p>
                        <p>Latitud: {locationData.latitude}</p>
                        <p>Longitud: {locationData.longitude}</p>
                        <p>Zona Horaria: {locationData.time_zone}</p>
                        <p>ASN: {locationData.asn}</p>
                        <p>Proveedor de Servicios: {locationData.as}</p>
                        <p>¿Es un proxy?: {locationData.is_proxy ? 'Sí' : 'No'}</p>
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default GeoLocation;
