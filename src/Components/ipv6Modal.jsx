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

const Ipv6Modal = () => {
    const [formdata, setFormdata] = useState({
        ipv6: "",
        prefixLength: "32",
        newPrefixLength: "56",
        subnetsCount: ""
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    const isValidIPv6 = (ipv6) => {
        const ipv6Regex = /^(?:[a-fA-F0-9]{1,4}:){7}[a-fA-F0-9]{1,4}|::(?:[a-fA-F0-9]{1,4}:){0,6}[a-fA-F0-9]{1,4}$/;
        return ipv6Regex.test(ipv6);
    };

    const isValidPrefixLength = (prefix) => {
        const prefixValue = parseInt(prefix, 10);
        return !isNaN(prefixValue) && prefixValue >= 0 && prefixValue <= 128;
    };

    const isValidSubnetsCount = (count) => {
        const countValue = parseInt(count, 10);
        return !isNaN(countValue) && countValue > 0;
    };

    const handleSubmit = async () => {
        setError('');

        const { ipv6, prefixLength, newPrefixLength, subnetsCount } = formdata;

        if (!isValidIPv6(ipv6)) {
            setError('La dirección IPv6 no es válida');
            return;
        }

        if (!isValidPrefixLength(prefixLength)) {
            setError('La longitud del prefijo no es válida');
            return;
        }

        if (!isValidPrefixLength(newPrefixLength)) {
            setError('La nueva longitud del prefijo no es válida');
            return;
        }

        if (!isValidSubnetsCount(subnetsCount)) {
            setError('La cantidad de subredes no es válida');
            return;
        }

        const data = {
            ipv6,
            prefixLength: parseInt(prefixLength, 10),
            newPrefixLength: parseInt(newPrefixLength, 10),
            subnetsCount: parseInt(subnetsCount, 10)
        };

        try {
            const response = await axios.post('https://upc-codex.tech:4475/API/V2/ipv6', data);
            setResult(response.data.subnets)
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
        const { ipv6, prefixLength, newPrefixLength, subnetsCount } = formdata;
        const data = {
            ipv6,
            prefixLength: parseInt(prefixLength, 10),
            newPrefixLength: parseInt(newPrefixLength, 10),
            subnetsCount: parseInt(subnetsCount, 10)
        };

        try {
            const response = await axios.post('https://upc-codex.tech:4475/API/V2/ipv6excel', data, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ipv6_subnets_report.xlsx');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setError('Hubo un error al generar el reporte de Excel');
            console.log(error);
        }
    };

    const generatePdfReport = async () => {
        const { ipv6, prefixLength, newPrefixLength, subnetsCount } = formdata;
        const data = {
            ipv6,
            prefixLength: parseInt(prefixLength, 10),
            newPrefixLength: parseInt(newPrefixLength, 10),
            subnetsCount: parseInt(subnetsCount, 10)
        };

        try {
            const response = await axios.post('https://upc-codex.tech:4475/API/V2/ipv6pdf', data, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'ipv6_subnets_report.pdf');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            setError('Hubo un error al generar el reporte de PDF');
            console.log(error);
        }
    };

    const resetForm = () => {
        setFormdata({
            ipv6: "",
            prefixLength: "",
            newPrefixLength: "",
            subnetsCount: ""
        });
        setResult(null);
        setError('');
        setActiveTab('details');
    };

    return (
        <div data-theme="bumblebee" className="flex flex-col items-center justify-start w-full">
            <div className="w-full lg:p-6 p-4 bg-base-200 rounded-lg h-full flex flex-col shadow-md">
                <div className='flex w-full justify-between items-center'>
                    <h1 className="text-3xl capitalize font-bold mb-4">Calculadora de Redes IPV6</h1>
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
                            <MdDeleteForever />  Limpiar
                        </button>
                    </div>
                </div>

                <div className="mb-4 flex gap-5 items-center lg:flex-row flex-col justify-between w-full">
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Dirección Ipv6</span>
                        </div>
                        <input
                            id="ipv6-input"
                            type="text"
                            name="ipv6"
                            placeholder="Ingresa la Dirección IPv6"
                            className="inputB w-full"
                            value={formdata.ipv6}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Longitud del Prefijo</span>
                        </div>
                        <input
                            id="prefix-length-input"
                            type="text"
                            name="prefixLength"
                            placeholder="Ingresa la Longitud del Prefijo"
                            className="inputB input-bordered w-full"
                            value={formdata.prefixLength}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="form-control w-full">
                        <div className="label">
                            <span className="label-text">Nueva Longitud del Prefijo</span>
                        </div>
                        <input
                            id="new-prefix-length-input"
                            type="text"
                            name="newPrefixLength"
                            placeholder="Ingresa la Nueva Longitud del Prefijo"
                            className="inputB input-bordered w-full"
                            value={formdata.newPrefixLength}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">Cantidad de Subredes</span>
                        </div>
                        <input
                            id="subnets-count"
                            type="text"
                            name="subnetsCount"
                            placeholder="Ingresa la Cantidad de Subredes"
                            className="inputB "
                            value={formdata.subnetsCount}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <button className="btn btn-primary w-full mb-4" onClick={handleSubmit}>
                    Generar
                </button>
                {error && <div className="text-red-500">{error}</div>}
                <div role="tablist" className="tabs tabs-boxed">
                    <a className={`tab  ${activeTab === 'details' ? 'tab-active' : ''}`} onClick={() => setActiveTab('details')}>Detalles</a>
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
                            {Object.keys(result).map((subnets, index) => (
                                <div key={index} className="mb-1">
                                    <div className='flex items-center gap-1'><FaNetworkWired /><p className="font-bold">Subred {index + 1}:</p></div>
                                    {result.map((subnet, subnetIndex) => (
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
                                        result.map((subnet, subnetIndex) => (
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
}

export default Ipv6Modal;
