import React, { useState } from 'react'
import { CarroPendiente } from '../types'
import { Trash2, MapPin, RotateCw, X } from 'lucide-react'
import { usePedidoContext } from '../contexts/PedidoContext'

const CarrosPendientesTab: React.FC = () => {
  const { pedidoSeleccionado, estaGestionando } = usePedidoContext()
  const [filtroNroDocumento, setFiltroNroDocumento] = useState('')
  const [filtroNroCarro, setFiltroNroCarro] = useState('')
  const [showReUbicarModal, setShowReUbicarModal] = useState(false)
  const [nuevaUbicacion, setNuevaUbicacion] = useState('')
  const [carroAReUbicar, setCarroAReUbicar] = useState<CarroPendiente | null>(null)

  // Datos base de carros pendientes
  const [carrosPendientesBase, setCarrosPendientesBase] = useState<CarroPendiente[]>([
    {
      id: '1',
      referencia: 'REF-001',
      codigoBarra: '1234567890123',
      descripcion: 'Producto A - Descripción completa',
      marca: 'Marca Alpha',
      zona: 'Zona-A',
      carro: 'CARR-001',
      cantidad: 50,
      ubicacionSugerida: 'A-01-15',
      usuario: 'Juan Pérez',
      fecha: '2024-01-15',
      nroDocumento: 'PED-001',
      estado: 'Pendiente',
      seleccionado: false
    },
    {
      id: '2',
      referencia: 'REF-002',
      codigoBarra: '1234567890124',
      descripcion: 'Producto B - Especificaciones técnicas',
      marca: 'Marca Beta',
      zona: 'Zona-B',
      carro: 'CARR-002',
      cantidad: 25,
      ubicacionSugerida: 'B-02-08',
      usuario: 'María García',
      fecha: '2024-01-16',
      nroDocumento: 'PED-002',
      estado: 'En Proceso',
      seleccionado: false
    },
    {
      id: '3',
      referencia: 'REF-003',
      codigoBarra: '1234567890125',
      descripcion: 'Producto C - Material resistente',
      marca: 'Marca Gamma',
      zona: 'Zona-A',
      carro: 'CARR-001',
      cantidad: 75,
      ubicacionSugerida: 'A-03-22',
      usuario: 'Carlos López',
      fecha: '2024-01-17',
      nroDocumento: 'PED-001',
      estado: 'Ubicado',
      seleccionado: false
    },
    {
      id: '4',
      referencia: 'REF-004',
      codigoBarra: '1234567890126',
      descripcion: 'Producto D - Alta calidad',
      marca: 'Marca Delta',
      zona: 'Zona-C',
      carro: 'CARR-003',
      cantidad: 30,
      ubicacionSugerida: 'C-01-05',
      usuario: 'Ana Ruiz',
      fecha: '2024-01-18',
      nroDocumento: 'PED-003',
      estado: 'Pendiente',
      seleccionado: false
    }
  ])

  // Función para actualizar carros (reemplaza setCarrosPendientes)
  const setCarrosPendientes = (updateFn: (prev: CarroPendiente[]) => CarroPendiente[]) => {
    setCarrosPendientesBase(updateFn)
  }

  // Filtrar carros basados en el pedido seleccionado
  const carrosPendientes = estaGestionando && pedidoSeleccionado
    ? carrosPendientesBase.filter(carro => carro.nroDocumento === pedidoSeleccionado.nroDocumento)
    : carrosPendientesBase

  const carrosFiltrados = carrosPendientes.filter(carro => {
    const matchNroDocumento = !filtroNroDocumento || carro.nroDocumento.toLowerCase().includes(filtroNroDocumento.toLowerCase())
    const matchNroCarro = !filtroNroCarro || carro.carro.toLowerCase().includes(filtroNroCarro.toLowerCase())
    return matchNroDocumento && matchNroCarro
  })

  const carrosSeleccionados = carrosPendientes.filter(carro => carro.seleccionado)

  const handleSelectAll = (checked: boolean) => {
    setCarrosPendientes(prev => prev.map(carro => ({ ...carro, seleccionado: checked })))
  }

  const handleSelectCarro = (id: string) => {
    setCarrosPendientes(prev => prev.map(carro => 
      carro.id === id ? { ...carro, seleccionado: !carro.seleccionado } : carro
    ))
  }

  const handleEliminar = () => {
    if (carrosSeleccionados.length === 0) return
    
    const confirmar = window.confirm(`¿Estás seguro de eliminar ${carrosSeleccionados.length} carro(s) seleccionado(s)?`)
    if (confirmar) {
      setCarrosPendientes(prev => prev.filter(carro => !carro.seleccionado))
      console.log('Carros eliminados:', carrosSeleccionados)
    }
  }

  const handleUbicar = () => {
    if (carrosSeleccionados.length === 0) return
    
    const confirmar = window.confirm(`¿Confirmar la ubicación de ${carrosSeleccionados.length} carro(s) seleccionado(s)?`)
    if (confirmar) {
      console.log('Carros ubicados:', carrosSeleccionados)
      // Actualizar el estado de los carros seleccionados a 'Ubicado'
      setCarrosPendientes(prev => prev.map(carro => 
        carro.seleccionado ? { ...carro, estado: 'Ubicado', seleccionado: false } : carro
      ))
    }
  }

  const handleReUbicar = () => {
    if (carrosSeleccionados.length !== 1) {
      alert('Selecciona exactamente un carro para reubicar')
      return
    }
    
    setCarroAReUbicar(carrosSeleccionados[0])
    setNuevaUbicacion(carrosSeleccionados[0].ubicacionSugerida)
    setShowReUbicarModal(true)
  }

  const handleSubmitReUbicacion = () => {
    if (!carroAReUbicar || !nuevaUbicacion) return

    setCarrosPendientes(prev => prev.map(carro => 
      carro.id === carroAReUbicar.id 
        ? { ...carro, ubicacionSugerida: nuevaUbicacion, seleccionado: false }
        : carro
    ))

    console.log('Carro reubicado:', {
      carro: carroAReUbicar,
      nuevaUbicacion
    })

    setShowReUbicarModal(false)
    setCarroAReUbicar(null)
    setNuevaUbicacion('')
  }

  const handleCloseReUbicarModal = () => {
    setShowReUbicarModal(false)
    setCarroAReUbicar(null)
    setNuevaUbicacion('')
  }

  const todosSeleccionados = carrosFiltrados.length > 0 && carrosFiltrados.every(carro => carro.seleccionado)

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Carros Pendientes de Ubicar
          {estaGestionando && pedidoSeleccionado && (
            <span className="ml-3 text-lg text-blue-600">
              - {pedidoSeleccionado.nroDocumento}
            </span>
          )}
        </h2>
        
        {!estaGestionando && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-sm text-yellow-800">
              💡 <strong>Información:</strong> Para ver carros pendientes específicos de un pedido, primero selecciona "Gestionar" en un pedido desde la pestaña "Pedidos Liberados".
            </p>
          </div>
        )}
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="filtroNroDocumento" className="block text-sm font-medium text-gray-700 mb-2">
              Nro Documento
            </label>
            <input
              type="text"
              id="filtroNroDocumento"
              value={filtroNroDocumento}
              onChange={(e) => setFiltroNroDocumento(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Buscar por número de documento..."
            />
          </div>
          <div>
            <label htmlFor="filtroNroCarro" className="block text-sm font-medium text-gray-700 mb-2">
              Nro Carro
            </label>
            <input
              type="text"
              id="filtroNroCarro"
              value={filtroNroCarro}
              onChange={(e) => setFiltroNroCarro(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Buscar por número de carro..."
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleEliminar}
            disabled={carrosSeleccionados.length === 0}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              carrosSeleccionados.length === 0
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-red-600 hover:bg-red-700'
            } transition-colors duration-200`}
          >
            <Trash2 className="w-5 h-5 mr-2" />
            Eliminar ({carrosSeleccionados.length})
          </button>
          <button
            onClick={handleUbicar}
            disabled={carrosSeleccionados.length === 0}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              carrosSeleccionados.length === 0
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          >
            <MapPin className="w-5 h-5 mr-2" />
            Ubicar ({carrosSeleccionados.length})
          </button>
          <button
            onClick={handleReUbicar}
            disabled={carrosSeleccionados.length !== 1}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              carrosSeleccionados.length !== 1
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-orange-600 hover:bg-orange-700'
            } transition-colors duration-200`}
          >
            <RotateCw className="w-5 h-5 mr-2" />
            ReUbicar ({carrosSeleccionados.length === 1 ? 1 : 0})
          </button>
        </div>

        {/* Tabla de Carros Pendientes */}
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  <input
                    type="checkbox"
                    checked={todosSeleccionados}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Referencia</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Código Barra</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Descripción</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Marca</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Zona</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Carro</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Cantidad</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Ubicación Sugerida</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Usuario</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Fecha</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carrosFiltrados.map((carro) => (
                <tr key={carro.id} className="hover:bg-gray-50">
                  <td className="px-4 py-5 border-r border-gray-200">
                    <input
                      type="checkbox"
                      checked={carro.seleccionado}
                      onChange={() => handleSelectCarro(carro.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-4 py-5 text-sm font-medium text-gray-900 border-r border-gray-200">{carro.referencia}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 font-mono">{carro.codigoBarra}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 max-w-xs truncate" title={carro.descripcion}>
                    {carro.descripcion}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{carro.marca}</td>
                  <td className="px-4 py-5 border-r border-gray-200">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {carro.zona}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm font-medium text-gray-900 border-r border-gray-200">{carro.carro}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 text-center font-semibold">{carro.cantidad}</td>
                  <td className="px-4 py-5 border-r border-gray-200">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {carro.ubicacionSugerida}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{carro.usuario}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{carro.fecha}</td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      carro.estado === 'Ubicado' ? 'bg-green-100 text-green-800' :
                      carro.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {carro.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para ReUbicar */}
        {showReUbicarModal && carroAReUbicar && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">ReUbicar Carro</h3>
                  <button
                    onClick={handleCloseReUbicarModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Información del Carro */}
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Información del Carro:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><strong>Referencia:</strong> {carroAReUbicar.referencia}</div>
                    <div><strong>Carro:</strong> {carroAReUbicar.carro}</div>
                    <div><strong>Zona:</strong> {carroAReUbicar.zona}</div>
                    <div><strong>Cantidad:</strong> {carroAReUbicar.cantidad}</div>
                    <div className="col-span-2"><strong>Descripción:</strong> {carroAReUbicar.descripcion}</div>
                  </div>
                </div>

                {/* Campo para Nueva Ubicación */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="nuevaUbicacion" className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Ubicación Sugerida
                    </label>
                    <input
                      type="text"
                      id="nuevaUbicacion"
                      value={nuevaUbicacion}
                      onChange={(e) => setNuevaUbicacion(e.target.value)}
                      placeholder="Ej: A-01-15, B-02-08, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Ubicación actual: <strong>{carroAReUbicar.ubicacionSugerida}</strong>
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCloseReUbicarModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitReUbicacion}
                    disabled={!nuevaUbicacion || nuevaUbicacion === carroAReUbicar.ubicacionSugerida}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                      nuevaUbicacion && nuevaUbicacion !== carroAReUbicar.ubicacionSugerida
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Cambiar Ubicación
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

export default CarrosPendientesTab