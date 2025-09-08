import React, { useState } from 'react'
import { PedidoLiberado } from '../types'
import { CheckCircle, Eye, Settings, Send } from 'lucide-react'
import { usePedidoContext } from '../contexts/PedidoContext'
import DetalleDocumentoView from './DetalleDocumentoView'

const PedidosLiberadosTab: React.FC = () => {
  const [filtroAlmacen, setFiltroAlmacen] = useState('')
  const [filtroNroDocumento, setFiltroNroDocumento] = useState('')
  const [vistaDetalle, setVistaDetalle] = useState(false)
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoLiberado | null>(null)
  const { setPedidoSeleccionado: setGestionarPedido, pedidoSeleccionado: pedidoEnGestion } = usePedidoContext()

  const [pedidosLiberados, setPedidosLiberados] = useState<PedidoLiberado[]>([
    {
      id: '1',
      nroDocumento: 'PED-001',
      tipoDocumento: 'Orden de Pedido',
      fechaCreacion: '2024-01-15',
      fechaLiberacion: '2024-01-16',
      almacen: 'ALM-001',
      transporte: 'Transportes XYZ',
      cantidadProductos: 25,
      seleccionado: false
    },
    {
      id: '2',
      nroDocumento: 'PED-002',
      tipoDocumento: 'Orden de Compra',
      fechaCreacion: '2024-01-16',
      fechaLiberacion: '2024-01-17',
      almacen: 'ALM-002',
      transporte: 'Transportes ABC',
      cantidadProductos: 42,
      seleccionado: false
    },
    {
      id: '3',
      nroDocumento: 'PED-003',
      tipoDocumento: 'Orden de Transferencia',
      fechaCreacion: '2024-01-17',
      fechaLiberacion: '2024-01-18',
      almacen: 'ALM-001',
      transporte: 'Transportes DEF',
      cantidadProductos: 18,
      seleccionado: false
    }
  ])

  const pedidosFiltrados = pedidosLiberados.filter(pedido => {
    const matchAlmacen = !filtroAlmacen || pedido.almacen.toLowerCase().includes(filtroAlmacen.toLowerCase())
    const matchNroDocumento = !filtroNroDocumento || pedido.nroDocumento.toLowerCase().includes(filtroNroDocumento.toLowerCase())
    return matchAlmacen && matchNroDocumento
  })

  const handleSelectPedido = (id: string) => {
    setPedidosLiberados(prev => prev.map(pedido => 
      pedido.id === id ? { ...pedido, seleccionado: true } : { ...pedido, seleccionado: false }
    ))
  }

  const handleConfirmarLlegada = () => {
    const pedidoSeleccionado = pedidosLiberados.find(pedido => pedido.seleccionado)
    if (pedidoSeleccionado) {
      const confirmar = window.confirm(
        `¿Confirmar la llegada del pedido?\n\n` +
        `Pedido: ${pedidoSeleccionado.nroDocumento}\n` +
        `Tipo: ${pedidoSeleccionado.tipoDocumento}\n` +
        `Almacén: ${pedidoSeleccionado.almacen}`
      )
      
      if (confirmar) {
        console.log('Confirmando llegada para:', pedidoSeleccionado)
        alert(
          `✅ Llegada confirmada exitosamente:\n\n` +
          `Pedido: ${pedidoSeleccionado.nroDocumento}\n` +
          `Se ha registrado la llegada del pedido al sistema.`
        )
        
        // Deseleccionar el pedido después de procesar
        setPedidosLiberados(prev => prev.map(pedido => 
          pedido.id === pedidoSeleccionado.id ? { ...pedido, seleccionado: false } : pedido
        ))
      }
    }
  }


  const handleVerDetalle = (pedido: PedidoLiberado) => {
    setPedidoSeleccionado(pedido)
    setVistaDetalle(true)
  }

  const handleVolverAlListado = () => {
    setVistaDetalle(false)
    setPedidoSeleccionado(null)
  }

  const handleGestionarPedido = (pedido: PedidoLiberado) => {
    setGestionarPedido(pedido)
    alert(`⚙️ Ahora estás gestionando el pedido: ${pedido.nroDocumento}\n\nLos próximos tabs mostrarán información relacionada con este pedido.`)
  }

  const handleEnviarSap = () => {
    const pedidoActual = pedidoSeleccionadoItem

    if (!pedidoActual) {
      alert('Por favor selecciona un pedido para enviar a SAP.')
      return
    }

    const confirmar = window.confirm(
      `¿Enviar pedido a SAP?\n\n` +
      `Pedido: ${pedidoActual.nroDocumento}\n` +
      `Tipo: ${pedidoActual.tipoDocumento}\n` +
      `Almacén: ${pedidoActual.almacen}`
    )
    
    if (confirmar) {
      console.log('Enviando pedido a SAP:', pedidoActual)
      alert(
        `✅ Pedido enviado a SAP exitosamente:\n\n` +
        `Pedido: ${pedidoActual.nroDocumento}\n` +
        `Tipo: ${pedidoActual.tipoDocumento}\n\n` +
        `📧 Los datos han sido enviados al sistema SAP.`
      )
      
      // Deseleccionar el pedido después de procesar
      setPedidosLiberados(prev => prev.map(pedido => 
        pedido.id === pedidoActual.id ? { ...pedido, seleccionado: false } : pedido
      ))
    }
  }

  const pedidoSeleccionadoItem = pedidosLiberados.find(pedido => pedido.seleccionado)

  // Si estamos en vista detalle, mostrar el componente de detalle
  if (vistaDetalle && pedidoSeleccionado) {
    return (
      <DetalleDocumentoView 
        pedido={pedidoSeleccionado} 
        onBack={handleVolverAlListado} 
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pedidos Liberados</h2>
        
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="filtroAlmacen" className="block text-sm font-medium text-gray-700 mb-2">
              Almacén
            </label>
            <select
              id="filtroAlmacen"
              value={filtroAlmacen}
              onChange={(e) => setFiltroAlmacen(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Todos los almacenes</option>
              <option value="ALM-001">ALM-001</option>
              <option value="ALM-002">ALM-002</option>
              <option value="ALM-003">ALM-003</option>
            </select>
          </div>
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
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleConfirmarLlegada}
            disabled={!pedidoSeleccionadoItem}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              !pedidoSeleccionadoItem
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-green-600 hover:bg-green-700'
            } transition-colors duration-200`}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirmar Llegada {pedidoSeleccionadoItem ? `(${pedidoSeleccionadoItem.nroDocumento})` : ''}
          </button>
          <button
            onClick={() => pedidoSeleccionadoItem && handleVerDetalle(pedidoSeleccionadoItem)}
            disabled={!pedidoSeleccionadoItem}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              !pedidoSeleccionadoItem
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-indigo-600 hover:bg-indigo-700'
            } transition-colors duration-200`}
          >
            <Eye className="w-5 h-5 mr-2" />
            Ver {pedidoSeleccionadoItem ? `(${pedidoSeleccionadoItem.nroDocumento})` : ''}
          </button>
          <button
            onClick={() => pedidoSeleccionadoItem && handleGestionarPedido(pedidoSeleccionadoItem)}
            disabled={!pedidoSeleccionadoItem}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              !pedidoSeleccionadoItem
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : pedidoEnGestion?.id === pedidoSeleccionadoItem?.id
                  ? 'text-white bg-green-600 hover:bg-green-700'
                  : 'text-white bg-orange-600 hover:bg-orange-700'
            } transition-colors duration-200`}
          >
            <Settings className="w-5 h-5 mr-2" />
            {pedidoSeleccionadoItem && pedidoEnGestion?.id === pedidoSeleccionadoItem.id 
              ? `Gestionando (${pedidoSeleccionadoItem.nroDocumento})` 
              : pedidoSeleccionadoItem 
                ? `Gestionar (${pedidoSeleccionadoItem.nroDocumento})`
                : 'Gestionar'
            }
          </button>
          <button
            onClick={handleEnviarSap}
            disabled={!pedidoSeleccionadoItem}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              !pedidoSeleccionadoItem
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar a SAP {pedidoSeleccionadoItem ? `(${pedidoSeleccionadoItem.nroDocumento})` : ''}
          </button>
        </div>

        {/* Tabla de Pedidos Liberados */}
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                  Selección
                </th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nro Documento</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tipo Documento</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Fecha Creación</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Fecha Liberación</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Almacén</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Transporte</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Cantidad Productos</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50">
                  <td className="px-4 py-5 border-r border-gray-200">
                    <input
                      type="radio"
                      name="pedido-selection"
                      checked={pedido.seleccionado}
                      onChange={() => handleSelectPedido(pedido.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-5 text-sm font-medium text-gray-900 border-r border-gray-200">{pedido.nroDocumento}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{pedido.tipoDocumento}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{pedido.fechaCreacion}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{pedido.fechaLiberacion}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{pedido.almacen}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{pedido.transporte}</td>
                  <td className="px-4 py-5 text-sm text-gray-900 text-center font-medium">{pedido.cantidadProductos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PedidosLiberadosTab