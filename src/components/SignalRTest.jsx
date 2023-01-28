import React, { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

function SignalRTest() {

    const [connection, setConnection] = useState(null);
    const [conStatus, setConStatus] = useState("");
    const [receivedMsg, setReceivedMsg] = useState(null);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const con = new HubConnectionBuilder()
            //.withUrl('http://localhost:5009/servicesMonitorHub')
            .withUrl("http://192.168.1.161:7003/servicesMonitorHub")
            .withAutomaticReconnect()
            .build();

        setConnection(con);
        setConStatus("Building SignalR connection...");

        fetch("http://192.168.1.161:7003/api/v1/Monitor", {
            method: 'put', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }).then(response => response.json()).then(obj => {
            setReceivedMsg(obj.data) 
        })
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(_ => {
                    setConStatus('Connected!');
                    connection.on('ClientServicesMonitorDataUpdate', objMsg => {
                        setRefreshCount(pre => pre + 1)
                        setReceivedMsg(objMsg)
                    });
                })
                .catch(e => {
                    setConStatus(`Connection failed`)
                    console.log("signalR error---------->", e)
                });
        }
    }, [connection]);

    return (
        <>
            <h1>{conStatus}</h1>
            <hr></hr>
            <h2>SignalR Message: (refresh: {refreshCount}) </h2>
            {
                receivedMsg && receivedMsg.map(msg =>
                    <div style={{ marginLeft: 100 }} key={msg.id}>
                        <h3>{msg.serviceName}</h3>
                        <pre>{JSON.stringify(msg, null, 5)} </pre>
                    </div>
                )
            }
        </>
    );
}

export default SignalRTest;