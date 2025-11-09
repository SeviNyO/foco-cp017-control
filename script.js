const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';
const PACKET_ON = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x01, 0x64, 0x1E, 0x01, 0x99]);
const PACKET_OFF = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x00, 0x64, 0x1E, 0x01, 0x99]);
// DEVICE_NAME_PREFIX ya no se usa

async function controlLuz(action) {
    document.getElementById('log').innerText = `Estado: Conectando para ${action}...`; 
    const packet = (action === 'ON') ? PACKET_ON : PACKET_OFF;
    
    try{
        // --- CAMBIO CLAVE ---
        // Ya no filtramos por nombre, pedimos que nos muestre TODOS
        // los dispositivos Bluetooth cercanos.
        document.getElementById('log').innerText = `¡Permiso! Busca y selecciona 'CP017' en la lista...`;
        
        const device = await navigator.bluetooth.requestDevice(
            {
                acceptAllDevices: true, // <-- Aceptar todos los dispositivos
                optionalServices: [SERVICE_UUID] // <-- Pero solo nos interesan los que tengan el Servicio FFE0
            }
        );
        
        // El resto del código es igual...
        const server = await device.gatt.connect();
        document.getElementById('log').innerText = `Estado: Conectado. Enviando ${action}...`;
        const service = await server.getPrimaryService(SERVICE_UUID);
        const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID); 
        await characteristic.writeValue(packet);
        document.getElementById('log').innerText = `✅ Comando ${action} enviado con éxito.`;
        server.disconnect(); 
    } catch (error){
        console.error('Fallo', error);
        document.getElementById('log').innerText = `❌ ERROR: Fallo al conectar. Revisa Bluetooth o UUIDs. ${error.name}`;
    }
}