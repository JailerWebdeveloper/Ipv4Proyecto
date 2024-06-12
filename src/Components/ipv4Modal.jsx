import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";
import { FaNetworkWired } from "react-icons/fa";
import { TbNetwork } from "react-icons/tb";
import { MdNetworkWifi } from "react-icons/md";
import { MdBroadcastOnPersonal } from "react-icons/md";
import { SiMicrosoftexcel } from "react-icons/si";
import { FaRegFilePdf } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { MdDeleteForever } from "react-icons/md";

const Ipv4Modal = () => {
    const [formdata, setFormdata] = useState({
        ip: "",
        netmaskBits: "",
        numSubnets: ""
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('details');

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

    const generateExcelReport = async () => {
        const { ip, netmaskBits, numSubnets } = formdata;
        const data = {
            ip,
            netmaskBits: parseInt(netmaskBits, 10),
            numSubnets: parseInt(numSubnets, 10)
        };

        try {
            const response = await axios.post('https://upc-codex.tech:4261/API/V2/excelsubnets', data, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'subnets_report.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setError('Hubo un error al generar el reporte de Excel');
            console.log(error);
        }
    };

    const generatePdfReport = async () => {
        const { ip, netmaskBits, numSubnets } = formdata;
        const data = {
            ip,
            netmaskBits: parseInt(netmaskBits, 10),
            numSubnets: parseInt(numSubnets, 10)
        };

        try {
            const response = await axios.post('https://upc-codex.tech:4261/API/V2/pdfsubnets', data, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'subnets_report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setError('Hubo un error al generar el reporte de PDF');
            console.log(error);
        }
    };

    const resetForm = () => {
        setFormdata({
            ip: "",
            netmaskBits: "",
            numSubnets: ""
        });
        setResult(null);
        setError('');
        setActiveTab('details');
    };

    return (
        <div data-theme="bumblebee" className="flex flex-col items-center justify-start w-full">
            <div className="w-full lg:p-6 p-4 bg-base-200 rounded-lg h-full flex flex-col shadow-md">
                <div className='flex w-full justify-between items-center'>
                    <h1 className="text-3xl capitalize font-bold mb-4">Calculadora de Redes IPV4</h1>
                    <div className='flex items-center justify-start gap-5'>
                        <button 
                            className='btn text-white btn-success' 
                            onClick={generateExcelReport}
                            disabled={!result}
                        >
                            <span><SiMicrosoftexcel /></span>Reporte en Excel
                        </button>
                        <button 
                            className='btn text-white btn-error'
                            onClick={generatePdfReport}
                            disabled={!result}
                        >
                            <FaRegFilePdf />Reporte en Pdf
                        </button>
                        <button 
                            className='btn text-white btn-error'
                            onClick={resetForm}
                        >
                          <MdDeleteForever/>  Limpiar
                        </button>
                    </div>
                </div>

                <div className="mb-4 flex gap-5 items-center lg:flex-row flex-col justify-between w-full">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Dirección Ipv4</span>
                        </div>
                        <input
                            id="ipv4-input"
                            type="text"
                            name="ip"
                            placeholder="Ingresa la Dirección IPv4"
                            className="inputB w-full"
                            value={formdata.ip}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Bits de máscara de red</span>
                        </div>
                        <input
                            id="netmask-input"
                            type="text"
                            name="netmaskBits"
                            placeholder={`${formdata.numSubnets !== "" ? "No puede ingresar Bits de mascara" : "Ingresa la Cantidad de Bits de mascara"}`}
                            className="inputB input-bordered w-full"
                            value={formdata.netmaskBits}
                            onChange={handleChange}
                            disabled={formdata.numSubnets !== ""}
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Número de subredes</span>
                        </div>
                        <input
                            id="numSubnets"
                            type="text"
                            name="numSubnets"
                            placeholder={`${formdata.netmaskBits !== "" ? "No puede ingresar Cantidad" : "Ingresa la Cantidad de subredes"}`}
                            className="inputB "
                            value={formdata.numSubnets}
                            onChange={handleChange}
                            disabled={formdata.netmaskBits !== ""}
                        />
                    </label>
                </div>
                <button className="btn btn-primary w-full mb-4" onClick={handleSubmit}>
                    Generar
                </button>
                {error && <div className="text-red-500">{error}</div>}
                <div role="tablist" className="tabs tabs-boxed">                    
                    <a className={`tab tab-success ${activeTab === 'details' ? 'tab-active' : ''}`} onClick={() => setActiveTab('details')}>Detalles</a>
                    <a className={`tab ${activeTab === 'table' ? 'tab-active' : ''}`} onClick={() => setActiveTab('table')}>Tabla</a>
                </div>
                <h2 className="text-lg font-bold mb-2 text-base-content">Resultado</h2>

                <AnimatePresence mode='wait'>
                    {activeTab === 'details' && result && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-base-200 h-[450px] flex flex-col gap-2 overflow-y-auto rounded-lg p-4"
                        >
                            {Object.keys(result).map((subred, index) => (
                                <div key={index} className="mb-1">
                                    <div className='flex items-center gap-1'><FaNetworkWired /><p className="font-bold">Subred {index + 1}:</p></div>
                                    {result[subred].map((subnet, subnetIndex) => (
                                        <div key={subnetIndex} className="pl-4 my-2 border-gray-500">
                                            <div className='flex items-center gap-2'><TbNetwork /><p>Valor: {subnet.value}</p></div>
                                            <p className='p-2 flex items-center gap-2'><MdNetworkWifi />IP Range: {subnet.ipRange.start} - {subnet.ipRange.end}</p>
                                            <p className='p-2 flex items-center gap-2'><MdBroadcastOnPersonal />Broadcast Address: {subnet.broadcastAddr}</p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'table' && result && (
                        <motion.div
                            key="table"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-x-auto"
                        >
                            <table className="table table-xs">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Subred</th>
                                        <th>Valor</th>
                                        <th>IP Range</th>
                                        <th>Broadcast Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(result).map((subred, index) => (
                                        result[subred].map((subnet, subnetIndex) => (
                                            <tr key={`${index}-${subnetIndex}`}>
                                                <th>{index + 1}</th>
                                                <td>Subred {index + 1}</td>
                                                <td>{subnet.value}</td>
                                                <td>{subnet.ipRange.start} - {subnet.ipRange.end}</td>
                                                <td>{subnet.broadcastAddr}</td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>#</th>
                                        <th>Subred</th>
                                        <th>Valor</th>
                                        <th>IP Range</th>
                                        <th>Broadcast Address</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Ipv4Modal;
