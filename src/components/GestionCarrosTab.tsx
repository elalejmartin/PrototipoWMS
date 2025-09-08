import React, { useState } from 'react'
import { GestionCarro } from '../types'
import { Scan, X, Plus, Trash2 } from 'lucide-react'
import { usePedidoContext } from '../contexts/PedidoContext'

const GestionCarrosTab: React.FC = () => {
  const { pedidoSeleccionado, estaGestionando } = usePedidoContext()
  const [filtroTipoCarro, setFiltroTipoCarro] = useState('')
  const [filtroModo, setFiltroModo] = useState('')
  const [filtroCodigo, setFiltroCodigo] = useState('')
  const [showEscanearModal, setShowEscanearModal] = useState(false)
  const [codigoCarro, setCodigoCarro] = useState('')
  const [carroSeleccionado, setCarroSeleccionado] = useState<GestionCarro | null>(null)
  const [codigoProducto, setCodigoProducto] = useState('')
  const [cantidadProducto, setCantidadProducto] = useState(1)
  const [productosEscaneados, setProductosEscaneados] = useState<{codigo: string, cantidad: number}[]>([])

  // Datos simulados con relación a pedidos específicos
  const [carrosBase] = useState<GestionCarro[]>([
    {
      id: '1',
      codigo: 'CARR-001',
      tipoCarro: 'Entrada',
      modo: 'Multiple',
      creadoPor: 'Juan Pérez',
      fechaCreacion: '2024-01-15',
      estado: 'Activo'
    },
    {
      id: '2',
      codigo: 'CARR-002',
      tipoCarro: 'Salida',
      modo: 'Mono',
      creadoPor: 'María García',
      fechaCreacion: '2024-01-16',
      estado: 'En Proceso'
    },
    {
      id: '3',
      codigo: 'CARR-003',
      tipoCarro: 'Entrada',
      modo: 'Multiple',
      creadoPor: 'Carlos López',
      fechaCreacion: '2024-01-17',
      estado: 'Completado'
    }
  ])

  // Filtrar carros basados en el pedido seleccionado
  const carros = estaGestionando && pedidoSeleccionado
    ? carrosBase.filter(carro => {
        // Simular relación entre carros y pedidos específicos
        if (pedidoSeleccionado.id === '1') {
          return carro.id === '1' || carro.id === '3' // PED-001 tiene carros CARR-001 y CARR-003
        } else if (pedidoSeleccionado.id === '2') {
          return carro.id === '2' // PED-002 tiene carro CARR-002
        } else if (pedidoSeleccionado.id === '3') {
          return carro.id === '1' // PED-003 tiene carro CARR-001
        }
        return false
      })
    : carrosBase

  const carrosFiltrados = carros.filter(carro => {
    const matchTipoCarro = !filtroTipoCarro || carro.tipoCarro === filtroTipoCarro
    const matchModo = !filtroModo || carro.modo === filtroModo
    const matchCodigo = !filtroCodigo || carro.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
    return matchTipoCarro && matchModo && matchCodigo
  })

  const handleEscanear = () => {
    setShowEscanearModal(true)
  }

  const handleBuscarCarro = () => {
    const carro = carros.find(c => c.codigo === codigoCarro)
    if (carro) {
      setCarroSeleccionado(carro)
      setProductosEscaneados([])
    } else {
      alert('Carro no encontrado')
    }
  }

  const handleAgregarProducto = () => {
    if (codigoProducto && !productosEscaneados.find(p => p.codigo === codigoProducto)) {
      if (carroSeleccionado?.modo === 'Mono' && productosEscaneados.length > 0) {
        alert('Los carros tipo Mono solo pueden tener un producto')
        return
      }
      if (cantidadProducto <= 0) {
        alert('La cantidad debe ser mayor a 0')
        return
      }
      setProductosEscaneados([...productosEscaneados, { codigo: codigoProducto, cantidad: cantidadProducto }])
      setCodigoProducto('')
      setCantidadProducto(1)
    }
  }

  const handleRemoverProducto = (codigoProducto: string) => {
    setProductosEscaneados(productosEscaneados.filter(p => p.codigo !== codigoProducto))
  }


  const handleSubmitEscaneo = () => {
    console.log('Escaneo realizado:', {
      carro: carroSeleccionado,
      productos: productosEscaneados
    })
    setShowEscanearModal(false)
    handleCloseModal()
  }

  const handleCloseModal = () => {
    setShowEscanearModal(false)
    setCodigoCarro('')
    setCarroSeleccionado(null)
    setCodigoProducto('')
    setCantidadProducto(1)
    setProductosEscaneados([])
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Carros
          {estaGestionando && pedidoSeleccionado && (
            <span className="ml-3 text-lg text-blue-600">
              - {pedidoSeleccionado.nroDocumento}
            </span>
          )}
        </h2>
        
        {!estaGestionando && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-sm text-yellow-800">
              💡 <strong>Información:</strong> Para ver carros específicos de un pedido, primero selecciona "Gestionar" en un pedido desde la pestaña "Pedidos Liberados".
            </p>
          </div>
        )}
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label htmlFor="filtroTipoCarro" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Carro
            </label>
            <select
              id="filtroTipoCarro"
              value={filtroTipoCarro}
              onChange={(e) => setFiltroTipoCarro(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Todos los tipos</option>
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>
          <div>
            <label htmlFor="filtroModo" className="block text-sm font-medium text-gray-700 mb-2">
              Multiple/Mono
            </label>
            <select
              id="filtroModo"
              value={filtroModo}
              onChange={(e) => setFiltroModo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Todos los modos</option>
              <option value="Multiple">Multiple</option>
              <option value="Mono">Mono</option>
            </select>
          </div>
          <div>
            <label htmlFor="filtroCodigo" className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <input
              type="text"
              id="filtroCodigo"
              value={filtroCodigo}
              onChange={(e) => setFiltroCodigo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Buscar por código..."
            />
          </div>
        </div>

        {/* Botón Escanear */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleEscanear}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
          >
            <Scan className="w-5 h-5 mr-2" />
            Escanear
          </button>
        </div>

        {/* Tabla de Carros */}
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Código</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tipo de Carro</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Modo</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Creado Por</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Fecha Creación</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {carrosFiltrados.map((carro) => (
                <tr key={carro.id} className="hover:bg-gray-50">
                  <td className="px-4 py-5 text-sm font-medium text-gray-900 border-r border-gray-200">{carro.codigo}</td>
                  <td className="px-4 py-5 border-r border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      carro.tipoCarro === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {carro.tipoCarro}
                    </span>
                  </td>
                  <td className="px-4 py-5 border-r border-gray-200">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      carro.modo === 'Multiple' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {carro.modo}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{carro.creadoPor}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{carro.fechaCreacion}</td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      carro.estado === 'Activo' ? 'bg-green-100 text-green-800' :
                      carro.estado === 'En Proceso' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {carro.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para Escanear */}
        {showEscanearModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-[500px] shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Escanear Carro y Productos</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Paso 1: Escanear Carro */}
                  <div>
                    <label htmlFor="codigoCarro" className="block text-sm font-medium text-gray-700 mb-2">
                      Código del Carro
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="codigoCarro"
                        value={codigoCarro}
                        onChange={(e) => setCodigoCarro(e.target.value)}
                        placeholder="Escanear o escribir código del carro..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!carroSeleccionado}
                      />
                      {!carroSeleccionado && (
                        <button
                          onClick={handleBuscarCarro}
                          disabled={!codigoCarro}
                          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            codigoCarro
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Buscar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Información del Carro Seleccionado */}
                  {carroSeleccionado && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="font-medium text-gray-900 mb-2">Carro Seleccionado:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Código:</strong> {carroSeleccionado.codigo}</div>
                        <div><strong>Tipo:</strong> 
                          <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                            carroSeleccionado.tipoCarro === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {carroSeleccionado.tipoCarro}
                          </span>
                        </div>
                        <div><strong>Modo:</strong> 
                          <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                            carroSeleccionado.modo === 'Multiple' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {carroSeleccionado.modo}
                          </span>
                        </div>
                        <div><strong>Estado:</strong> {carroSeleccionado.estado}</div>
                      </div>
                      {carroSeleccionado.modo === 'Mono' && (
                        <p className="text-xs text-orange-600 mt-2">
                          ⚠️ Este carro solo puede tener un producto
                        </p>
                      )}
                    </div>
                  )}

                  {/* Paso 2: Escanear Productos */}
                  {carroSeleccionado && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agregar Producto
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={codigoProducto}
                            onChange={(e) => setCodigoProducto(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAgregarProducto()}
                            placeholder="Código del producto..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="number"
                            min="1"
                            value={cantidadProducto}
                            onChange={(e) => setCantidadProducto(parseInt(e.target.value) || 1)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAgregarProducto()}
                            placeholder="Cant."
                            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={handleAgregarProducto}
                            disabled={!codigoProducto || cantidadProducto <= 0 || (carroSeleccionado.modo === 'Mono' && productosEscaneados.length > 0)}
                            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                              codigoProducto && cantidadProducto > 0 && !(carroSeleccionado.modo === 'Mono' && productosEscaneados.length > 0)
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lista de Productos Escaneados */}
                  {productosEscaneados.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Productos Escaneados:</h4>
                        <div className="text-xs text-gray-500">
                          💡 Para cambiar cantidad: eliminar y volver a agregar
                        </div>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {productosEscaneados.map((producto, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-green-800">{producto.codigo}</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-600">Cantidad:</span>
                                <span className="text-sm font-semibold text-green-700">{producto.cantidad}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoverProducto(producto.codigo)}
                              className="text-red-500 hover:text-red-700 ml-3"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-500">
                    {productosEscaneados.length > 0 && (
                      <span>{productosEscaneados.length} producto(s) escaneado(s)</span>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                    >
                      Cancelar
                    </button>
                    {carroSeleccionado && !carroSeleccionado && (
                      <button
                        onClick={() => setCarroSeleccionado(null)}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors duration-200"
                      >
                        Cambiar Carro
                      </button>
                    )}
                    <button
                      onClick={handleSubmitEscaneo}
                      disabled={!carroSeleccionado || productosEscaneados.length === 0}
                      className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                        carroSeleccionado && productosEscaneados.length > 0
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Finalizar Escaneo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GestionCarrosTab