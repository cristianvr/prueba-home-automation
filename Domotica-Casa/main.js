

var net = require('net');
var mysql = require('mysql');

var commit = "";

consultar();
setInterval(consultar,5000);



function consultar(){

    var connection = mysql.createConnection({
        host     : '51.161.116.203',
        user     : 'ceenford_cvrserv',
        password : 'servicioscvrelectronica',
        database : 'ceenford_cvr_servicios_clientes'
      });

    connection.connect();

    connection.query("SELECT * FROM home_automation WHERE ID=1",(error,result,fields)=>{
        if(error) throw error;
        console.log("Ejecuntando consulta \r\n Sistema de automatizacion \r\n CVRelectronica \r\n Version de prueba \r\n\r\n");
        var id = result[0].ID;
    
        bd_commit = result[0].commit;
        if(commit != bd_commit){
            commit = bd_commit;
    
            var connection_data = result[0].connection_data;
            cd = JSON.parse(connection_data);
            
            var ip_terminal = cd.ip;
            var port_terminal = cd.port;
            var command = result[0].command;
            sendAction(ip_terminal,port_terminal,command);
        }
        // console.log("F: "+JSON.strinfy(fields));
    });
    
    connection.end();
}

function sendAction(ip,port,action){
    var client = new net.Socket();
    client.end();
    try {
        client.connect(port,ip, ()=>{
            console.log("Comando enviado a dispositivo!");
            client.write(action);
        });
    } catch (error) {
        if(error) throw error;
        client.end();
        try {
            client.connect(port,ip, ()=>{
                console.log("Comando enviado a dispositivo!");
                client.write(action);
            });
        } catch (error) {
            if(error) throw error;
            console.log("Segundo intento de conexion fallido! :(");
        }
        
    }
    


}