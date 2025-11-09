// Constantes de Control (Servicios que USAMOS)
const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; // FFE0 (Correcto)
const CHARACTERISTIC_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb'; // FFE1 (Correcto)

// Constante de Nombre (El Filtro que BUSCAMOS)
const DEVICE_NAME_PREFIX = 'CP017'; // (Correcto)

// Paquetes (Esto está bien)
const PACKET_ON = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x01, 0x64, 0x1E, 0x01, 0x99]);
const PACKET_OFF = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x00, 0x64, 0x1E, 0x01, 0x99]);

async function controlLuz(action) {
    document.getElementById('log').innerText = `Estado: Conectando para ${action}...`; 
    const packet = (action === 'ON') ? PACKET_ON : PACKET_OFF;
    
    try{
        document.getElementById('log').innerText = `¡Permiso! Busca y selecciona 'CP017' en la lista...`;

        // --- CAMBIO CLAVE (Volvemos al Filtro de Nombre) ---
        const device = await navigator.bluetooth.requestDevice(
            {
                // Filtramos por el nombre que SÍ vemos
                filters: [{ namePrefix: DEVICE_NAME_PREFIX }],
                
                // Pedimos permiso para USAR el servicio FFE0 (el de control)
                optionalServices: [SERVICE_UUID] 
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