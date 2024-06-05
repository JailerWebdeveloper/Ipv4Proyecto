import React, { useState } from 'react';
import axios from 'axios';
import "../App.css";

const Ipv4Modal = () => {
    const [formdata, setFormdata] = useState({
        ip: "",
        netmaskBits: "",
        numSubnets: ""
    });
    const [result, setResult] = useState('');
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
        setResult('');

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
            setResult(JSON.stringify(response.data, null, 2));
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
        <div className="flex flex-col lg:p-10 p-4 items-center justify-center h-screen w-full bg-base-200">
            <div className="w-full lg:p-6 p-4 bg-base-100 rounded-lg h-full flex flex-col shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-base-content">IPv4 Port Range and Subnet Mask</h1>
                <div className="mb-4 flex gap-5 items-center lg:flex-row flex-col justify-center">
                    <input
                        id="ipv4-input"
                        type="text"
                        name="ip"
                        placeholder="Ingresa la Direccion IPv4"
                        className="input input-bordered w-full"
                        value={formdata.ip}
                        onChange={handleChange}
                    />
                    <input
                        id="netmask-input"
                        type="text"
                        name="netmaskBits"
                        placeholder="Ingresa la Cantidad de bits de la mascara"
                        className="input input-bordered w-full"
                        value={formdata.netmaskBits}
                        onChange={handleChange}
                    />
                    <input
                        id="numSubnets"
                        type="text"
                        name="numSubnets"
                        placeholder="Ingresa la Cantidad de subredes"
                        className="input input-bordered w-full"
                        value={formdata.numSubnets}
                        onChange={handleChange}
                    />
                </div>
                <button className="btn btn-primary w-full mb-4" onClick={handleSubmit}>
                    Generar
                </button>
                {error && <div className="text-red-500">{error}</div>}
                <div className="bg-base-200 rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2 text-base-content">Results</h2>
                    {result && (
                        <pre className="typing-effect text-base-content whitespace-pre-wrap">{result}</pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ipv4Modal;
