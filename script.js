// --- Constantes de Servicios que Vimos en LightBlue ---
const SERVICE_UUID_CONTROL = '0000ffe0-0000-1000-8000-00805f9b34fb'; // FFE0 (Control)
const SERVICE_UUID_WRITE = '0000ffe1-0000-1000-8000-00805f9b34fb'; // FFE1 (Escritura)
const SERVICE_UUID_NOTIFY = '0000ffe2-0000-1000-8000-00805f9b34fb'; // FFE2 (Notificación)
const SERVICE_UUID_AD = '0000af30-0000-1000-8000-00805f9b34fb'; // AF30 (Anuncio)

// --- Paquetes (Esto está bien) ---
const PACKET_ON = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x01, 0x64, 0x1E, 0x01, 0x99]);
const PACKET_OFF = new Uint8Array([0xAA, 0x55, 0x00, 0x00, 0x00, 0x00, 0x64, 0x1E, 0x01, 0x99]);

async function controlLuz(action) {
    document.getElementById('log').innerText = `Estado: Conectando para ${action}...`; 
    const packet = (action === 'ON') ? PACKET_ON : PACKET_OFF;
    
    try{
        document.getElementById('log').innerText = `¡Permiso! Busca y selecciona 'CP017' en la lista...`;

        // --- CAMBIO CLAVE (Aceptar TODO y pedir todos los servicios) ---
        const device = await navigator.bluetooth.requestDevice(
            {
                // ¡Filtro eliminado! Muestra TODOS los dispositivos.
                acceptAllDevices: true, 
                
                // Pedimos permiso para USAR todos los servicios que vimos en LightBlue
                optionalServices: [
                    SERVICE_UUID_CONTROL, 
                    SERVICE_UUID_WRITE, 
                    SERVICE_UUID_NOTIFY, 
                    SERVICE_UUID_AD
                ] 
            }
        );
        
        // El resto del código usa los UUIDs correctos (FFE0 y FFE1)
        const server = await device.gatt.connect();
        document.getElementById('log').innerText = `Estado: Conectado. Enviando ${action}...`;
        const service = await server.getPrimaryService(SERVICE_UUID_CONTROL); // FFE0
        const characteristic = await service.getCharacteristic(SERVICE_UUID_WRITE); // FFE1
        
        await characteristic.writeValue(packet);
        document.getElementById('log').innerText = `✅ Comando ${action} enviado con éxito.`;
        server.disconnect(); 
    } catch (error){
        console.error('Fallo', error);
        document.getElementById('log').innerText = `❌ ERROR: Fallo al conectar. Revisa Bluetooth o UUIDs. ${error.name}`;
    }
}