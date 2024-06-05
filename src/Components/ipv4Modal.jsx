import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";
import { FaNetworkWired } from "react-icons/fa";
import { TbNetwork } from "react-icons/tb";
import { MdNetworkWifi } from "react-icons/md";
import { MdBroadcastOnPersonal } from "react-icons/md";

const Ipv4Modal = () => {
    const [formdata, setFormdata] = useState({
        ip: "",
        netmaskBits: "",
        numSubnets: ""
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const isValidIPv4 = (ip) => {
        const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
        return ipv4Regex.test(ip);
    };

    const isValidNetmaskBits = (bits) => {
        const bitValue = parseInt(bits, 10);
        return !isNaN(bitValue) && bitValue >= 0 && bitValue <= 32;
    };

    const isValidNumSubnets = (num) => {
        const numValue = parseInt(num, 10);
        return !isNaN(numValue) && numValue > 0;
    };

    const handleSubmit = async () => {
        setError('');

        const { ip, netmaskBits, numSubnets } = formdata;

        if (!isValidIPv4(ip)) {
            setError('La dirección IPv4 no es válida');
            return;
        }

        if (!isValidNetmaskBits(netmaskBits)) {
            setError('La cantidad de bits de la máscara no es válida');
            return;
        }

        if (!isValidNumSubnets(numSubnets)) {
            setError('La cantidad de subredes no es válida');
            return;
        }

        const data = {
            ip,
            netmaskBits: parseInt(netmaskBits, 10),
            numSubnets: parseInt(numSubnets, 10)
        };

        try {
            const response = await axios.post('https://upc-codex.tech:4261/API/V2/subnets', data);
            setResult(response.data);
        } catch (error) {
            setError('Hubo un error al enviar la solicitud');
            console.log(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata({
            ...formdata,
            [name]: value
        });
    };

    return (
        <div className="flex flex-col lg:px-10 lg:py-5 p-4 items-center justify-start min-h-screen w-full bg-base-200">
            <div className="lg:w-4/5  lg:p-6 p-4 bg-base-100 rounded-lg h-full flex flex-col shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-base-content">Calculadora de Redes IPV4</h1>
                <div className="mb-4 flex gap-5 items-center lg:flex-row flex-col justify-between w-full" >
                    <label className="form-control w-full ">
                        <div className="label">
                            <span className="label-text">Direccion Ipv4</span>
                        </div>
                        <input
                            id="ipv4-input"
                            type="text"
                            name="ip"
                            placeholder="Ingresa la Direccion IPv4"
                            className="input input-bordered w-full"
                            value={formdata.ip}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Bits de mascara de red</span>
                        </div>
                        <input
                        id="netmask-input"
                        type="text"
                        name="netmaskBits"
                        placeholder="Ingresa la Cantidad de bits de la mascara"
                        className="input input-bordered w-full"
                        value={formdata.netmaskBits}
                        onChange={handleChange}
                    />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Numero de subredes</span>
                        </div>
                        <input
                        id="numSubnets"
                        type="text"
                        name="numSubnets"
                        placeholder="Ingresa la Cantidad de subredes"
                        className="input input-bordered "
                        value={formdata.numSubnets}
                        onChange={handleChange}
                    />
                    </label>
                   
                </div>
                <button className="btn btn-primary w-full mb-4" onClick={handleSubmit}>
                    Generar
                </button>
                {error && <div className="text-red-500">{error}</div>}
                <h2 className="text-lg font-bold mb-2 text-base-content">Resultado</h2>

                {result && (

                    <div className="bg-base-200 h-[450px] flex flex-col gap-2  overflow-y-auto rounded-lg  p-4">
                        {Object.keys(result).map((subred, index) => (
                            <div key={index} className=" mb-1">
                                <div className='flex items-center gap-1'><FaNetworkWired /><p className="font-bold">Subred {index + 1}:</p></div>
                                {result[subred].map((subnet, subnetIndex) => (
                                    <div key={subnetIndex} className="pl-4 my-2 border-gray-500">
                                        <div className='flex items-center gap-2'><TbNetwork /><p>Valor: {subnet.value}</p></div>
                                        <p className='p-2 flex items-center gap-2'><MdNetworkWifi/>IP Range: {subnet.ipRange.start} - {subnet.ipRange.end}</p>
                                        <p className='p-2 flex items-center gap-2'><MdBroadcastOnPersonal/>Broadcast Address: {subnet.broadcastAddr}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Ipv4Modal;
