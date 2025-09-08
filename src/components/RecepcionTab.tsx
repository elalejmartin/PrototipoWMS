import React, { useState } from 'react'
import { Recepcion, ControlItem } from '../types'
import { Search, Package, Truck, User, Calendar, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const RecepcionTab: React.FC = () => {
  const [filtroDocumento, setFiltroDocumento] = useState('')
  const [filtroEstatus, setFiltroEstatus] = useState('')
  const [recepcionSeleccionada, setRecepcionSeleccionada] = useState<Recepcion | null>(null)
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  // Datos simulados de recepciones
  const [recepciones] = useState<Recepcion[]>([
    {
      id: '1',
      estatus: 'En Proceso',
      avance: 65,
      documento: 'REC-2024-001',
      tipoDocumento: 'Orden de Compra',
      fechaDocumentoSAP: '2024-01-15',
      fechaRecepcionadoSAP: '2024-01-16',
      fechaInicio: '2024-01-16 08:30',
      fechaFin: '',
      liberarBloquear: 'Liberar',
      fechaLiberacion: '',
      liberadoPor: '',
      almacen: 'ALM-001 Central',
      puerta: 'P-03',
      comentarios: 'Recepción de productos electrónicos',
      codigoProveedor: 'PROV-001',
      proveedor: 'Tecnología Avanzada S.A.',
      contenedor: 'CONT-789123',
      selloContenedor: 'SEAL-456',
      placaVehiculo: 'ABC-123',
      chofer: 'Carlos Mendoza',
      nombreTransporte: 'Logística Express'
    },
    {
      id: '2',
      estatus: 'Completado',
      avance: 100,
      documento: 'REC-2024-002',
      tipoDocumento: 'Factura',
      fechaDocumentoSAP: '2024-01-14',
      fechaRecepcionadoSAP: '2024-01-15',
      fechaInicio: '2024-01-15 09:00',
      fechaFin: '2024-01-15 11:30',
      liberarBloquear: 'Liberado',
      fechaLiberacion: '2024-01-15 11:35',
      liberadoPor: 'María García',
      almacen: 'ALM-002 Norte',
      puerta: 'P-01',
      comentarios: 'Recepción sin observaciones',
      codigoProveedor: 'PROV-002',
      proveedor: 'Suministros Industriales Ltda.',
      contenedor: 'CONT-456789',
      selloContenedor: 'SEAL-789',
      placaVehiculo: 'XYZ-456',
      chofer: 'Ana López',
      nombreTransporte: 'Transporte Seguro'
    },
    {
      id: '3',
      estatus: 'Pendiente',
      avance: 0,
      documento: 'REC-2024-003',
      tipoDocumento: 'Orden de Compra',
      fechaDocumentoSAP: '2024-01-17',
      fechaRecepcionadoSAP: '2024-01-18',
      fechaInicio: '',
      fechaFin: '',
      liberarBloquear: 'Bloquear',
      fechaLiberacion: '',
      liberadoPor: '',
      almacen: 'ALM-001 Central',
      puerta: 'P-05',
      comentarios: 'Esperando llegada del transporte',
      codigoProveedor: 'PROV-003',
      proveedor: 'Materiales de Construcción S.A.',
      contenedor: 'CONT-123456',
      selloContenedor: 'SEAL-123',
      placaVehiculo: 'DEF-789',
      chofer: 'Roberto Silva',
      nombreTransporte: 'Carga Pesada'
    }
  ])

  const recepcionesFiltradas = recepciones.filter(recepcion => {
    const matchDocumento = !filtroDocumento || recepcion.documento.toLowerCase().includes(filtroDocumento.toLowerCase())
    const matchEstatus = !filtroEstatus || recepcion.estatus === filtroEstatus
    return matchDocumento && matchEstatus
  })

  const handleVerDetalles = (recepcion: Recepcion) => {
    setRecepcionSeleccionada(recepcion)
    setMostrarDetalles(true)
  }

  const handleCerrarDetalles = () => {
    setMostrarDetalles(false)
    setRecepcionSeleccionada(null)
  }

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'Completado':
        return 'bg-green-100 text-green-800'
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEstatusIcon = (estatus: string) => {
    switch (estatus) {
      case 'Completado':
        return <CheckCircle className="w-4 h-4" />
      case 'En Proceso':
        return <Clock className="w-4 h-4" />
      case 'Pendiente':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Recepciones</h2>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="filtroDocumento" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Documento
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="filtroDocumento"
                value={filtroDocumento}
                onChange={(e) => setFiltroDocumento(e.target.value)}
                className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                placeholder="REC-2024-001..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="filtroEstatus" className="block text-sm font-medium text-gray-700 mb-2">
              Estatus
            </label>
            <select
              id="filtroEstatus"
              value={filtroEstatus}
              onChange={(e) => setFiltroEstatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Todos los estatus</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completado">Completado</option>
            </select>
          </div>
        </div>

        {/* Tabla de Recepciones */}
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Documento</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Proveedor</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Almacén</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estatus</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Avance</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recepcionesFiltradas.map((recepcion) => (
                <tr key={recepcion.id} className="hover:bg-gray-50">
                  <td className="px-4 py-5 text-sm font-bold text-gray-900">
                    {recepcion.documento}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900">
                    {recepcion.tipoDocumento}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{recepcion.proveedor}</div>
                      <div className="text-gray-500 text-xs">{recepcion.codigoProveedor}</div>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900">
                    {recepcion.almacen}
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getEstatusColor(recepcion.estatus)}`}>
                      {getEstatusIcon(recepcion.estatus)}
                      <span className="ml-1">{recepcion.estatus}</span>
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            recepcion.avance === 100 ? 'bg-green-500' : 
                            recepcion.avance > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${recepcion.avance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{recepcion.avance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <button
                      onClick={() => handleVerDetalles(recepcion)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensaje cuando no hay recepciones */}
        {recepcionesFiltradas.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Package className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recepciones</h3>
            <p className="text-gray-500 mb-4">No se encontraron recepciones que coincidan con los filtros seleccionados</p>
          </div>
        )}

        {/* Modal de Detalles */}
        {mostrarDetalles && recepcionSeleccionada && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalles de Recepción - {recepcionSeleccionada.documento}
                  </h3>
                  <button
                    onClick={handleCerrarDetalles}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {/* Información del Documento */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Información del Documento
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Documento:</strong> {recepcionSeleccionada.documento}</div>
                      <div><strong>Tipo:</strong> {recepcionSeleccionada.tipoDocumento}</div>
                      <div><strong>Fecha Documento SAP:</strong> {recepcionSeleccionada.fechaDocumentoSAP}</div>
                      <div><strong>Fecha Recepcionado SAP:</strong> {recepcionSeleccionada.fechaRecepcionadoSAP}</div>
                      <div><strong>Comentarios:</strong> {recepcionSeleccionada.comentarios}</div>
                    </div>
                  </div>

                  {/* Información del Proveedor */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Proveedor y Transporte
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Proveedor:</strong> {recepcionSeleccionada.proveedor}</div>
                      <div><strong>Código:</strong> {recepcionSeleccionada.codigoProveedor}</div>
                      <div><strong>Transporte:</strong> {recepcionSeleccionada.nombreTransporte}</div>
                      <div><strong>Chofer:</strong> {recepcionSeleccionada.chofer}</div>
                      <div><strong>Placa:</strong> {recepcionSeleccionada.placaVehiculo}</div>
                    </div>
                  </div>

                  {/* Información del Almacén */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Almacén y Ubicación
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Almacén:</strong> {recepcionSeleccionada.almacen}</div>
                      <div><strong>Puerta:</strong> {recepcionSeleccionada.puerta}</div>
                      <div><strong>Contenedor:</strong> {recepcionSeleccionada.contenedor}</div>
                      <div><strong>Sello:</strong> {recepcionSeleccionada.selloContenedor}</div>
                    </div>
                  </div>

                  {/* Información de Fechas */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Fechas y Estado
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Fecha Inicio:</strong> {recepcionSeleccionada.fechaInicio || 'No iniciado'}</div>
                      <div><strong>Fecha Fin:</strong> {recepcionSeleccionada.fechaFin || 'En proceso'}</div>
                      <div><strong>Estado:</strong> {recepcionSeleccionada.liberarBloquear}</div>
                      {recepcionSeleccionada.fechaLiberacion && (
                        <>
                          <div><strong>Fecha Liberación:</strong> {recepcionSeleccionada.fechaLiberacion}</div>
                          <div><strong>Liberado Por:</strong> {recepcionSeleccionada.liberadoPor}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleCerrarDetalles}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecepcionTab