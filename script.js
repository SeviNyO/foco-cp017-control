const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; 
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; 
const PACKET_ON = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x01, 0x64, 0x1E, 0x01, 0x99]);
const PACKET_OFF = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x00, 0x64, 0x1E, 0x01, 0x99]);
const DEVICE_NAME_PREFIX = 'CP017'; 
async function controlLuz(action) {
    document.getElementById('log').innerText = `Estado: Conectando para ${action}...`; 
    const packet = (action === 'ON') ? PACKET_ON : PACKET_OFF;
    
    try{
        const device = await navigator.bluetooth.requestDevice(
            {
                filters: [{ namePrefix: DEVICE_NAME_PREFIX }],
                optionalServices: [SERVICE_UUID]
            }
        );
        
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