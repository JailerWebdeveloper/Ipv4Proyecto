import React, { useState } from 'react';

const Ipv4bits = () => {
    const [byte1, setByte1] = useState([0, 0, 0, 0, 0, 0, 0, 0]);

    const tdclick = (element) => {
        let valor = document.getElementById(element).innerHTML;
        let nombreMascara = "m" + element.slice(1, 3);
        let mascaraValor = document.getElementById(nombreMascara).innerHTML;
        if (mascaraValor === '0') {
            if (valor === '1') {
                document.getElementById(element).innerHTML = '0';
                document.getElementById(element).className = 'bit inactiva';
            } else {
                document.getElementById(element).innerHTML = '1';
                document.getElementById(element).className = 'bit activa';
            }
            let nombreByte = element.slice(0, 2);
            actualizarByte(nombreByte);
        }
    };

    const actualizarByte = (nombreByte) => {
        let resultado = 0;
        for (let i = 8; i > 0; i--) {
            let nombre = nombreByte + i;
            let valor = document.getElementById(nombre).innerHTML;
            if (valor === '1') {
                resultado += Math.pow(2, 8 - i);
            }
        }
        document.getElementById(nombreByte).innerHTML = resultado;
    };

    const activaAyuda = (boton) => {
        let x = document.getElementById("ayudaValores");
        let valor = x.style.display;
        if (valor === 'none') {
            x.style.display = 'table-row';
            document.getElementById(boton).innerHTML = 'AYUDA OFF';
            document.getElementById(boton).className = 'btn btn-sucess';
        } else {
            x.style.display = 'none';
            document.getElementById(boton).innerHTML = 'AYUDA ON';
            document.getElementById(boton).className = 'btn btn-sucess';
        }
    };

    const msclick = (element) => {
        let posMascara = element.slice(1, 3);
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 8; j++) {
                let posActual = "" + i + j;
                let mActual = "m" + posActual;
                if (posActual <= posMascara) {
                    document.getElementById(mActual).innerHTML = '1';
                    document.getElementById(mActual).className = 'bit mactiva';
                } else {
                    document.getElementById(mActual).innerHTML = '0';
                    document.getElementById(mActual).className = 'bit minactiva';
                }
            }
        }
    };

    const limpiarMascara = () => {
        for (let i = 1; i <= 4; i++) {
            for (let j = 1; j <= 8; j++) {
                let posActual = "" + i + j;
                let mActual = "m" + posActual;
                document.getElementById(mActual).innerHTML = '0';
                document.getElementById(mActual).className = 'bit minactiva';
            }
        }
    };

    return (
        <>
            <h1>Calculadora y Simulador IPv4</h1>
            <table>
                <tbody className=''>
                    <tr>
                        <td>IPv4 DECIMAL</td>
                        <td className='space'>&nbsp;</td>
                        {byte1.map((bit, index) => (
                            <td key={index} className="ip"><span id={`b${index + 1}`}>{bit}</span></td>
                        ))}
                    </tr>
                    <tr id="ayudaValores" style={{ display: 'none' }}>
                        <td colSpan="2">&nbsp;</td>
                        {[128, 64, 32, 16, 8, 4, 2, 1].map((valor, index) => (
                            <td key={index} className='valores'>{valor}</td>
                        ))}
                    </tr>
                    <tr>
                        <td>IPv4 BINARIO</td>
                        <td className='space'>&nbsp;</td>
                        {[...Array(32)].map((_, index) => (
                            <td key={index} className='bit' id={`b${index + 1}`} onClick={() => tdclick(`b${index + 1}`)}>0</td>
                        ))}
                    </tr>
                    <tr>
                        <td colSpan="37">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>MÁSCARA RED</td>
                        <td className='space'>&nbsp;</td>
                        {[...Array(32)].map((_, index) => (
                            <td key={index} className='bit' id={`m${index + 1}`} onClick={() => msclick(`m${index + 1}`)}>0</td>
                        ))}
                    </tr>
                </tbody>
            </table>
            <p>&nbsp;</p>
            <hr />
            <button type="button" id="botonAyuda" className="btn btn-light" onClick={() => activaAyuda("botonAyuda")}>AYUDA ON</button>
            <button type="button" id="botonAyuda" className="btn btn-light" onClick={limpiarMascara}>LIMPIAR MÁSCARA</button>
        </>
    );
};

export default Ipv4bits;
