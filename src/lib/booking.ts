/**
 * Mensaje con el que se abre WhatsApp al pedir cita desde una ficha de
 * servicio. Si no se indica servicio se usa el mensaje que la dueña tenga
 * guardado en el panel («Datos de contacto»), así que esto solo se aplica
 * cuando sabemos qué quiere reservar la clienta.
 */
export function bookingMessage(service: string) {
  return `¡Hola Alma Rizo! Me gustaría reservar cita para «${service}» 🌿 ¿Qué horas tenéis disponibles?`;
}
