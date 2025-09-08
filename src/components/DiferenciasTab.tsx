import React, { useState } from 'react'
import { Diferencia } from '../types'
import { FileX } from 'lucide-react'
import { usePedidoContext } from '../contexts/PedidoContext'

const DiferenciasTab: React.FC = () => {
  const { pedidoSeleccionado, estaGestionando } = usePedidoContext()
  const [filtroNroDocumento, setFiltroNroDocumento] = useState('')
  const [filtroCodigoBarra, setFiltroCodigoBarra] = useState('')

  const [diferenciasBase] = useState<Diferencia[]>([
    {
      id: '1',
      nroDocumento: 'PED-001',
      codigoBarra: '1234567890123',
      descripcion: 'Producto A - Descripción completa del artículo',
      marca: 'Marca Alpha',
      cantidadRecibida: 48,
      cantidadEsperada: 50,
      diferencia: -2,
      comentario: 'Faltaron 2 unidades en el envío'
    },
    {
      id: '2',
      nroDocumento: 'PED-002',
      codigoBarra: '1234567890124',
      descripcion: 'Producto B - Especificaciones técnicas avanzadas',
      marca: 'Marca Beta',
      cantidadRecibida: 30,
      cantidadEsperada: 25,
      diferencia: 5,
      comentario: 'Se recibieron 5 unidades adicionales'
    },
    {
      id: '3',
      nroDocumento: 'PED-001',
      codigoBarra: '1234567890125',
      descripcion: 'Producto C - Material resistente de alta calidad',
      marca: 'Marca Gamma',
      cantidadRecibida: 70,
      cantidadEsperada: 75,
      diferencia: -5,
      comentario: 'Diferencia debido a productos dañados en tránsito'
    },
    {
      id: '4',
      nroDocumento: 'PED-003',
      codigoBarra: '1234567890126',
      descripcion: 'Producto D - Artículo premium con garantía extendida',
      marca: 'Marca Delta',
      cantidadRecibida: 15,
      cantidadEsperada: 20,
      diferencia: -5,
      comentario: 'Productos faltantes por problemas de inventario'
    },
    {
      id: '5',
      nroDocumento: 'PED-002',
      codigoBarra: '1234567890127',
      descripcion: 'Producto E - Componente electrónico especializado',
      marca: 'Marca Epsilon',
      cantidadRecibida: 100,
      cantidadEsperada: 95,
      diferencia: 5,
      comentario: 'Envío con bonificación del proveedor'
    }
  ])

  // Filtrar diferencias basadas en el pedido seleccionado
  const diferencias = estaGestionando && pedidoSeleccionado
    ? diferenciasBase.filter(diferencia => diferencia.nroDocumento === pedidoSeleccionado.nroDocumento)
    : diferenciasBase

  const diferenciasFiltradas = diferencias.filter(diferencia => {
    const matchNroDocumento = !filtroNroDocumento || diferencia.nroDocumento.toLowerCase().includes(filtroNroDocumento.toLowerCase())
    const matchCodigoBarra = !filtroCodigoBarra || diferencia.codigoBarra.includes(filtroCodigoBarra)
    return matchNroDocumento && matchCodigoBarra
  })


  const getDiferenciaColor = (diferencia: number) => {
    if (diferencia > 0) return 'text-green-600 bg-green-50'
    if (diferencia < 0) return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getDiferenciaIcon = (diferencia: number) => {
    if (diferencia > 0) return '+'
    return ''
  }


  const handleNotificar = () => {
    const pedidoActual = estaGestionando && pedidoSeleccionado 
      ? pedidoSeleccionado.nroDocumento 
      : 'Todas las diferencias'

    // Solo considerar diferencias negativas (faltantes) para notificar
    const diferenciasParaNotificar = diferenciasFiltradas.filter(d => d.diferencia < 0)
    
    if (diferenciasParaNotificar.length === 0) {
      alert('No hay diferencias faltantes para notificar.')
      return
    }

    const confirmar = window.confirm(
      `¿Notificar las diferencias faltantes?\n\n` +
      `Pedido: ${pedidoActual}\n` +
      `Diferencias faltantes: ${diferenciasParaNotificar.length}\n\n` +
      `Productos con faltantes:\n` +
      diferenciasParaNotificar.map(d => `• ${d.descripcion} (${d.diferencia})`).slice(0, 5).join('\n') +
      (diferenciasParaNotificar.length > 5 ? '\n...y más' : '')
    )
    
    if (confirmar) {
      console.log('Notificando diferencias:', diferenciasParaNotificar)
      
      // Simular proceso de notificación
      const numeroNotificacion = 'NOT-' + Math.random().toString(36).substr(2, 8).toUpperCase()
      
      alert(
        `✅ Notificación enviada exitosamente:\n\n` +
        `Número de notificación: ${numeroNotificacion}\n` +
        `Pedido: ${pedidoActual}\n` +
        `Diferencias reportadas: ${diferenciasParaNotificar.length}\n\n` +
        diferenciasParaNotificar.map(d => 
          `• ${d.descripcion} (${d.diferencia})`
        ).slice(0, 5).join('\n') +
        (diferenciasParaNotificar.length > 5 ? `\n...y ${diferenciasParaNotificar.length - 5} más` : '') +
        `\n\n📧 La notificación ha sido enviada al sistema correspondiente.`
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Diferencias
          {estaGestionando && pedidoSeleccionado && (
            <span className="ml-3 text-lg text-blue-600">
              - {pedidoSeleccionado.nroDocumento}
            </span>
          )}
        </h2>
        
        {!estaGestionando && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-sm text-yellow-800">
              💡 <strong>Información:</strong> Para ver diferencias específicas de un pedido, primero selecciona "Gestionar" en un pedido desde la pestaña "Pedidos Liberados".
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
            <label htmlFor="filtroCodigoBarra" className="block text-sm font-medium text-gray-700 mb-2">
              Código Barra
            </label>
            <input
              type="text"
              id="filtroCodigoBarra"
              value={filtroCodigoBarra}
              onChange={(e) => setFiltroCodigoBarra(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Buscar por código de barra..."
            />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleNotificar}
            disabled={diferenciasFiltradas.filter(d => d.diferencia < 0).length === 0}
            className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
              diferenciasFiltradas.filter(d => d.diferencia < 0).length === 0
                ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                : 'text-white bg-purple-600 hover:bg-purple-700'
            } transition-colors duration-200`}
          >
            <FileX className="w-5 h-5 mr-2" />
            Notificar ({diferenciasFiltradas.filter(d => d.diferencia < 0).length})
          </button>
        </div>

        {/* Tabla de Diferencias */}
        <div className="border border-gray-200 rounded-lg overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Nro Documento</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Código Barra</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Descripción</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Marca</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Cantidad Recibida</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Cantidad Esperada</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Diferencia</th>
                <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Comentario</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diferenciasFiltradas.map((diferencia) => (
                <tr key={diferencia.id} className="hover:bg-gray-50">
                  <td className="px-4 py-5 text-sm font-medium text-gray-900 border-r border-gray-200">
                    {diferencia.nroDocumento}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 font-mono">
                    {diferencia.codigoBarra}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 max-w-xs">
                    <div className="truncate" title={diferencia.descripcion}>
                      {diferencia.descripcion}
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">
                    {diferencia.marca}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 text-center font-semibold">
                    {diferencia.cantidadRecibida}
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200 text-center font-semibold">
                    {diferencia.cantidadEsperada}
                  </td>
                  <td className="px-4 py-5 border-r border-gray-200 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDiferenciaColor(diferencia.diferencia)}`}>
                      {getDiferenciaIcon(diferencia.diferencia)}{diferencia.diferencia}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={diferencia.comentario}>
                      {diferencia.comentario}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de Diferencias */}
        {diferenciasFiltradas.length > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de Diferencias:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>Faltantes: {diferenciasFiltradas.filter(d => d.diferencia < 0).length}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>Sobrantes: {diferenciasFiltradas.filter(d => d.diferencia > 0).length}</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-500 rounded-full mr-2"></span>
                <span>Sin Diferencias: {diferenciasFiltradas.filter(d => d.diferencia === 0).length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiferenciasTab