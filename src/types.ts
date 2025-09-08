export interface Recepcion {
  id: string;
  estatus: string;
  avance: number;
  documento: string;
  tipoDocumento: string;
  fechaDocumentoSAP: string;
  fechaRecepcionadoSAP: string;
  fechaInicio: string;
  fechaFin: string;
  liberarBloquear: string;
  fechaLiberacion: string;
  liberadoPor: string;
  almacen: string;
  puerta: string;
  comentarios: string;
  codigoProveedor: string;
  proveedor: string;
  contenedor: string;
  selloContenedor: string;
  placaVehiculo: string;
  chofer: string;
  nombreTransporte: string;
}

export interface ControlItem {
  id: string;
  linea: string;
  referencia: string;
  descripcion: string;
  fechaPick: string;
  pickeadoPor: string;
  cantidadRecibida: number;
  cantidadEsperada: number;
  diferenciaCantidades: number;
  comentario: string;
}

export interface CarroItem {
  id: string;
  documentoRecepcion: string;
  referencia: string;
  codBarras: string;
  descripcion: string;
  cantidad: number;
  carroFecha: string;
  ubicacionSugerida: string;
  seleccionado: boolean;
}

export interface Diferencia {
  id: string;
  nroOrden: string;
  fechaCreacion: string;
  fechaIngreso: string;
  estado: string;
  tipo: string;
}

export interface PedidoLiberado {
  id: string;
  nroDocumento: string;
  tipoDocumento: string;
  fechaCreacion: string;
  fechaLiberacion: string;
  almacen: string;
  transporte: string;
  cantidadProductos: number;
  seleccionado: boolean;
}

export interface GestionCarro {
  id: string;
  codigo: string;
  tipoCarro: 'Entrada' | 'Salida';
  modo: 'Multiple' | 'Mono';
  creadoPor: string;
  fechaCreacion: string;
  estado: string;
}

export interface CarroPendiente {
  id: string;
  referencia: string;
  codigoBarra: string;
  descripcion: string;
  marca: string;
  zona: string;
  carro: string;
  cantidad: number;
  ubicacionSugerida: string;
  usuario: string;
  fecha: string;
  nroDocumento: string;
  estado: 'Pendiente' | 'Ubicado' | 'En Proceso';
  seleccionado: boolean;
}

export interface Diferencia {
  id: string;
  nroDocumento: string;
  codigoBarra: string;
  descripcion: string;
  marca: string;
  cantidadRecibida: number;
  cantidadEsperada: number;
  diferencia: number;
  comentario: string;
}

export interface PedidoDetalle {
  id: string;
  codigoProducto: string;
  descripcion: string;
  marca: string;
  cantidad: number;
  precio: number;
  total: number;
  comentario: string;
}

export interface CrearCarro {
  id: string;
  codigo: string;
  tipo: 'Multiple' | 'Mono';
  tipoCarro: 'Entrada' | 'Salida';
  fechaCreacion: string;
  estado: 'Creado' | 'En Uso' | 'Completado';
  seleccionado: boolean;
}

export type TabType = 'pedidosLiberados' | 'gestionCarros' | 'carrosPendientes' | 'diferencias' | 'crearCarros' | 'recepcion';