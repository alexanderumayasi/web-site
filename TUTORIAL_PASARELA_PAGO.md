# 🎮 Tutorial de Uso - Simulación de Pasarela de Pago

## 📚 Guía Paso a Paso

### Paso 1: Iniciar la Aplicación

```powershell
# En la carpeta del backend
cd backend
npm run dev

# En otra terminal, en la carpeta del frontend
cd frontend
npm run dev
```

### Paso 2: Agregar Productos al Carrito

1. Abre tu navegador en `http://localhost:3000`
2. Navega a la tienda de productos
3. Selecciona uno o más productos
4. Haz clic en "Agregar al Carrito"
5. Verás un badge con el número de items en el ícono del carrito

### Paso 3: Ir al Carrito

1. Haz clic en el ícono del carrito en la parte superior derecha
2. Verás todos tus productos agregados
3. Puedes ajustar cantidades con los botones + y -
4. Verás el resumen con:
   - Subtotal
   - Envío (gratis si es mayor a S/ 100)
   - IGV (18%)
   - Total

### Paso 4: Proceder al Checkout

1. Haz clic en "Proceder al Pago" en la página del carrito
2. Serás redirigido a `/checkout`
3. Completa el formulario con tu información:

#### Información de Contacto:
```
Nombre: Juan
Apellidos: Pérez García
Email: juan.perez@example.com
Teléfono: 987654321
```

#### Dirección de Envío:
```
Dirección: Av. Larco 1234, Miraflores
Ciudad: Lima
Provincia: Lima
Código Postal: 15074
```

#### Método de Pago:
- Selecciona "Tarjeta de crédito/débito" (recomendado para la simulación)
- O puedes elegir "Yape / Plin" o "Transferencia bancaria"

### Paso 5: Aceptar Términos

1. Marca la casilla "Acepto los términos y condiciones"
2. El botón "Proceder al Pago" se activará

### Paso 6: Abrir la Pasarela de Pago

1. Haz clic en "Proceder al Pago"
2. Se abrirá el modal de la pasarela de pago simulada
3. Verás el monto total a pagar destacado

### Paso 7: Simular Pago Exitoso

#### Opción 1: Tarjeta Exitosa
```
Número de Tarjeta: 4532 1234 5678 9010
Nombre en la Tarjeta: JUAN PEREZ
Fecha de Vencimiento: 12/25
CVV: 123
```

1. Ingresa los datos anteriores
2. El sistema formateará automáticamente:
   - El número de tarjeta con espacios
   - La fecha con formato MM/AA
3. Haz clic en "Pagar S/ [MONTO]"
4. Verás una animación de carga (2 segundos)
5. Aparecerá la pantalla de éxito con:
   - ✅ Ícono de check verde
   - Número de transacción generado
   - Monto pagado
6. Haz clic en "Continuar"
7. Serás redirigido a la página de confirmación

### Paso 8: Ver Confirmación de Pedido

En la página de éxito verás:
- ✅ Mensaje de confirmación
- 📋 Número de orden único
- 💳 Método de pago usado
- 💰 Total pagado
- 🔢 ID de transacción
- 📅 Fecha y hora de la compra
- 📝 Próximos pasos
- 🔘 Botones para volver al inicio o seguir comprando

---

## 🧪 Escenarios de Prueba Adicionales

### Escenario 2: Pago Rechazado

```
Número de Tarjeta: 4532 1234 5678 0000
Nombre en la Tarjeta: JUAN PEREZ
Fecha de Vencimiento: 12/25
CVV: 123
```

**Resultado esperado:**
- ❌ Pantalla de error
- Mensaje: "Tarjeta rechazada. Fondos insuficientes o tarjeta bloqueada."
- Botones: "Intentar nuevamente" o "Cancelar"

### Escenario 3: CVV Inválido

```
Número de Tarjeta: 4532 1234 5678 9010
Nombre en la Tarjeta: JUAN PEREZ
Fecha de Vencimiento: 12/25
CVV: 000
```

**Resultado esperado:**
- ❌ Pantalla de error
- Mensaje: "CVV inválido. Por favor verifica los datos de tu tarjeta."

### Escenario 4: Tarjeta Expirada

```
Número de Tarjeta: 4532 1234 5678 9010
Nombre en la Tarjeta: JUAN PEREZ
Fecha de Vencimiento: 12/20
CVV: 123
```

**Resultado esperado:**
- ❌ Pantalla de error
- Mensaje: "La tarjeta ha expirado."

### Escenario 5: Yape / Plin

1. Selecciona "Yape / Plin" en el método de pago
2. Al abrir el modal verás:
   - 📱 Código QR simulado
   - Número para Yape: 987 654 321
   - Monto a pagar
3. Haz clic en "Pagar S/ [MONTO]"
4. Simulará el pago exitosamente

### Escenario 6: Transferencia Bancaria

1. Selecciona "Transferencia bancaria"
2. Al abrir el modal verás:
   - 🏦 Datos bancarios completos:
     - Banco: BCP
     - Cuenta: 191-1234567-8-90
     - CCI: 00219100123456789012
     - Titular: Gaming Store SAC
3. Haz clic en "Pagar S/ [MONTO]"
4. Recibirás instrucciones para enviar el comprobante

---

## 🎯 Tips y Trucos

### Formateo Automático
- El número de tarjeta se formatea automáticamente con espacios cada 4 dígitos
- La fecha se formatea como MM/AA automáticamente al escribir
- El CVV solo acepta números

### Validaciones
- Todos los campos marcados con * son obligatorios
- El email debe tener formato válido
- La fecha de vencimiento debe ser futura
- El CVV debe tener 3 o 4 dígitos

### Cerrar el Modal
- Puedes cerrar el modal haciendo clic en la X
- Puedes hacer clic fuera del modal para cerrarlo
- Puedes usar el botón "Cancelar"
- No se puede cerrar mientras está procesando el pago

### Información de Prueba Visible
- En el modal verás un cuadro amarillo con información de prueba
- Los datos sugeridos están visibles directamente en el formulario

---

## 📱 Pruebas en Móvil

El modal es completamente responsive. Para probar en móvil:

1. Abre Chrome DevTools (F12)
2. Activa el modo de dispositivo (Ctrl+Shift+M)
3. Selecciona un dispositivo móvil
4. Prueba el flujo completo

El modal se ajustará automáticamente al tamaño de la pantalla.

---

## 🐛 Solución de Problemas

### El modal no se abre
- Verifica que hayas completado todos los campos requeridos
- Asegúrate de haber aceptado los términos y condiciones
- Verifica la consola del navegador para errores

### El pago no se procesa
- Verifica tu conexión a internet
- Revisa que el backend esté corriendo
- Verifica la consola para errores de API

### El carrito no se limpia
- Verifica que el store del carrito esté funcionando
- Asegúrate de estar autenticado
- Revisa los errores en la consola

---

## 📊 Datos que se Envían al Backend

Cuando el pago es exitoso, se envía al backend:

```json
{
  "shippingAddress": {
    "firstName": "Juan",
    "lastName": "Pérez García",
    "address": "Av. Larco 1234, Miraflores",
    "city": "Lima",
    "state": "Lima",
    "zipCode": "15074",
    "phone": "987654321"
  },
  "paymentMethod": "card",
  "paymentData": {
    "transactionId": "TXN-ABC123XYZ",
    "amount": 4918.28,
    "cardLastFour": "9010"
  },
  "notes": ""
}
```

---

## 🎨 Personalización

### Cambiar Colores
Edita `PaymentGatewayModal.vue`:
- `bg-primary-600`: Color del botón de pago
- `from-primary-600 to-blue-600`: Gradiente del header
- `text-green-500`: Color de éxito
- `text-red-500`: Color de error

### Cambiar Tiempo de Procesamiento
En `PaymentGatewayModal.vue`, línea ~285:
```javascript
await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos
```

### Agregar Más Escenarios de Prueba
En la función `processPayment`:
```javascript
if (lastFourDigits === 'XXXX') {
  paymentStatus.value = 'error';
  errorMessage.value = 'Tu mensaje de error';
}
```

---

## 📚 Recursos Adicionales

- **Nuxt 3**: https://nuxt.com/docs
- **Vue 3**: https://vuejs.org/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Pinia**: https://pinia.vuejs.org/

---

**¡Disfruta probando tu nueva pasarela de pago simulada!** 🎉
