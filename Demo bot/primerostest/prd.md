# Product Requirements Document (PRD)

## 🏨 Agente AI para Cotización de Viajes

### 📌 **Objetivo del Proyecto**
Automatizar el proceso de cotización de paquetes de viaje para agencias minoristas, utilizando **AgentQL**, **Manychat**, **Make**, **Google Sheets** y **Trello**. La versión demo utilizará **Despegar y Booking** en lugar de los sitios mayoristas para facilitar la validación del flujo.

---

## ⚙️ **Arquitectura del Sistema**

### **Herramientas y Tecnologías**
| Herramienta  | Uso |
|-------------|------|
| **Manychat** | Conversación entre vendedor y agente AI |
| **Make** | Orquestación del flujo de datos |
| **AgentQL** | Automatización de búsqueda de paquetes en Despegar/Booking |
| **Google Sheets** | Almacenamiento de datos de consultas y resultados |
| **Trello** | Pipeline de cotizaciones |
| **PDFMonkey / DocSpring** | Generación del presupuesto en PDF |

---

## 🔹 **Flujo del Producto**

### **1️⃣ Solicitud de Cotización**
- Un usuario final solicita un presupuesto a través de un vendedor.
- El vendedor ingresa los parámetros en **Manychat**:
  - Destino
  - Fecha de salida y regreso
  - Tipo de hotel (categoría de estrellas)
  - Cantidad de pasajeros
  - Tipo de vuelo (económico/business)
  - Presupuesto estimado (opcional)

### **2️⃣ Manychat envía los datos a Make**
- Make almacena la consulta en **Google Sheets** y **Trello**.
- Se dispara la búsqueda automática en **AgentQL**.

### **3️⃣ Búsqueda en Despegar/Booking con AgentQL**
- Se inicia sesión en **Despegar** y **Booking** (si es necesario).
- Se extraen los 5 mejores paquetes según los criterios ingresados.
- Se devuelve la información estructurada a **Make**:
  - Nombre del hotel y aerolínea.
  - Precio original.
  - Disponibilidad de fechas.
  - Tipo de habitación o vuelo.
  - Enlace a la oferta (solo para el vendedor, no para el usuario final).

### **4️⃣ Generación del PDF de Cotización**
- Se calcula el precio ajustado (markup para la agencia).
- Se genera un PDF con:
  - Opciones de paquetes con los precios ajustados.
  - Información clara y atractiva para el usuario final (sin links).
- El PDF se almacena en Google Drive y se enlaza a Trello.

### **5️⃣ Manychat envía los resultados al vendedor**
- El vendedor recibe:
  - **El PDF con precios ajustados** para enviárselo al usuario final.
  - **Los links originales (privados)** para gestionar la compra en los sitios mayoristas.

---

## 🔹 **Consumo del Agente AI desde Make**

Para que Make pueda consumir los datos del Agente AI en AgentQL, se seguirá el siguiente flujo:

### **1️⃣ Configuración del Endpoint de AgentQL**
- Se creará un **API Endpoint** en AgentQL con las siguientes características:
  - Recibirá una solicitud HTTP POST con los parámetros de búsqueda.
  - Ejecutará la consulta en Despegar/Booking.
  - Retornará los 5 mejores resultados en formato JSON.

Ejemplo de **solicitud HTTP POST**:
```json
{
  "destino": "Barcelona",
  "fecha_salida": "2025-03-10",
  "fecha_regreso": "2025-03-20",
  "estrellas": "4",
  "pasajeros": "2",
  "tipo_vuelo": "económico"
}
```

### **2️⃣ Integración en Make**
- Se agregará un módulo en **Make** que haga una **solicitud HTTP** al endpoint de AgentQL.
- Se mapearán los datos obtenidos en JSON a Google Sheets y Trello.
- Se activará la generación del PDF con la información extraída.

### **3️⃣ Formato de Respuesta de AgentQL**
AgentQL responderá con un JSON estructurado similar a este:
```json
{
  "paquetes": [
    {
      "hotel": "Hotel Barcelona Center",
      "aerolinea": "Iberia",
      "precio": "1200",
      "disponibilidad": "Sí",
      "tipo_habitacion": "Doble",
      "link": "https://despegar.com/ejemplo"
    },
    {
      "hotel": "Hotel Ramblas",
      "aerolinea": "Air Europa",
      "precio": "1100",
      "disponibilidad": "Sí",
      "tipo_habitacion": "Doble",
      "link": "https://booking.com/ejemplo"
    }
  ]
}
```

### **4️⃣ Procesamiento en Make**
- Se almacenarán los datos en **Google Sheets**.
- Se generará el **PDF con precios ajustados** sin incluir los links.
- Se enviarán los **links privados** al vendedor en Manychat.

---

## 🛠 **Tareas para Implementación**

### **✅ Configuración de Manychat**
1. Crear el bot en **Manychat** con flujos de preguntas para capturar la información del usuario.
2. Conectar Manychat con **Make** usando Webhooks.

### **✅ Integración en Make**
1. Crear un flujo en **Make** que reciba la consulta y la almacene en **Google Sheets** y **Trello**.
2. Disparar la ejecución de **AgentQL** para buscar paquetes.

### **✅ Desarrollo del Agente AI en Cursor con AgentQL**
1. Crear el endpoint API en **AgentQL** para recibir consultas.
2. Implementar la automatización para buscar en **Despegar** y **Booking**.
3. Enviar los datos en JSON a **Make**.

### **✅ Generación del PDF con los Presupuestos**
1. Configurar **PDFMonkey / DocSpring** para recibir los datos y generar un documento atractivo.
2. Subir el PDF a Google Drive y enlazarlo en **Trello**.

### **✅ Envío de Resultados a Manychat**
1. Enviar el PDF con precios ajustados al vendedor.
2. Enviar los links privados solo al vendedor.