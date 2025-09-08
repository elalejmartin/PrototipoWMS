import React, { useState } from 'react'
import { PedidoLiberado, PedidoDetalle } from '../types'
import { ArrowLeft, Save, FileText } from 'lucide-react'

interface DetalleDocumentoViewProps {
  pedido: PedidoLiberado
  onBack: () => void
}

const DetalleDocumentoView: React.FC<DetalleDocumentoViewProps> = ({ pedido, onBack }) => {
  const [comentarioGeneral, setComentarioGeneral] = useState('')
  const [productos, setProductos] = useState<PedidoDetalle[]>([
    {
      id: '1',
      codigoProducto: 'PROD-001',
      descripcion: 'Producto Premium A - Especificaciones técnicas avanzadas',
      marca: 'Marca Alpha',
      cantidad: 10,
      precio: 125.50,
      total: 1255.00,
      comentario: ''
    },
    {
      id: '2',
      codigoProducto: 'PROD-002',
      descripcion: 'Producto Estándar B - Calidad garantizada',
      marca: 'Marca Beta',
      cantidad: 5,
      precio: 89.99,
      total: 449.95,
      comentario: ''
    },
    {
      id: '3',
      codigoProducto: 'PROD-003',
      descripcion: 'Producto Especializado C - Uso industrial',
      marca: 'Marca Gamma',
      cantidad: 8,
      precio: 200.00,
      total: 1600.00,
      comentario: ''
    },
    {
      id: '4',
      codigoProducto: 'PROD-004',
      descripcion: 'Producto Básico D - Excelente relación calidad-precio',
      marca: 'Marca Delta',
      cantidad: 15,
      precio: 45.75,
      total: 686.25,
      comentario: ''
    },
    {
      id: '5',
      codigoProducto: 'PROD-005',
      descripcion: 'Producto Exclusivo E - Edición limitada',
      marca: 'Marca Epsilon',
      cantidad: 3,
      precio: 350.00,
      total: 1050.00,
      comentario: ''
    }
  ])

  const handleComentarioChange = (productId: string, comentario: string) => {
    setProductos(prev => prev.map(producto => 
      producto.id === productId ? { ...producto, comentario } : producto
    ))
  }

  const handleGuardarDocumento = () => {
    const documentoConComentarios = {
      pedido,
      comentarioGeneral: comentarioGeneral.trim(),
      productos: productos.map(p => ({
        ...p,
        comentario: p.comentario.trim()
      }))
    }
    
    console.log('Documento guardado:', documentoConComentarios)
    
    const tieneComentarioGeneral = comentarioGeneral.trim().length > 0
    const productosConComentarios = productos.filter(p => p.comentario.trim()).length
    
    alert(`Documento ${pedido.nroDocumento} guardado correctamente.\n${tieneComentarioGeneral ? 'Comentario general incluido.\n' : ''}${productosConComentarios} comentario(s) de productos.`)
  }

  const totalGeneral = productos.reduce((sum, producto) => sum + producto.total, 0)
  const productosConComentarios = productos.filter(p => p.comentario.trim()).length

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {/* Header con botón de regreso */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </button>
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Detalle del Documento</h2>
                <p className="text-gray-600">Documento: {pedido.nroDocumento}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleGuardarDocumento}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            <Save className="w-5 h-5 mr-2" />
            Guardar Documento
          </button>
        </div>

        {/* Información General del Documento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nro Documento</label>
            <p className="text-lg font-semibold text-gray-900">{pedido.nroDocumento}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Documento</label>
            <p className="text-lg text-gray-900">{pedido.tipoDocumento}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Creación</label>
            <p className="text-lg text-gray-900">{pedido.fechaCreacion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Liberación</label>
            <p className="text-lg text-gray-900">{pedido.fechaLiberacion}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Almacén</label>
            <p className="text-lg text-gray-900">{pedido.almacen}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transporte</label>
            <p className="text-lg text-gray-900">{pedido.transporte}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Productos</label>
            <p className="text-lg font-semibold text-blue-600">{pedido.cantidadProductos}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total General</label>
            <p className="text-lg font-semibold text-green-600">${totalGeneral.toFixed(2)}</p>
          </div>
        </div>

        {/* Comentario General */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Comentario General del Documento</h3>
          <div className="bg-gray-50 p-6 rounded-lg">
            <label htmlFor="comentarioGeneral" className="block text-sm font-medium text-gray-700 mb-3">
              Agregar comentario general sobre este documento
            </label>
            <textarea
              id="comentarioGeneral"
              value={comentarioGeneral}
              onChange={(e) => setComentarioGeneral(e.target.value)}
              placeholder="Escriba aquí cualquier observación, nota o comentario general sobre este documento..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              rows={4}
              maxLength={500}
            />
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-500">
                {comentarioGeneral.length}/500 caracteres
              </span>
            </div>
            {comentarioGeneral.trim().length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">
                  ✓ Comentario general agregado. Recuerda guardar el documento para conservar los cambios.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Detalle de Productos</h3>
          
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Código</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Descripción</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Marca</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Cantidad</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Precio Unit.</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Total</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Comentario</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900 border-r border-gray-200 font-mono">
                      {producto.codigoProducto}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 max-w-xs">
                      <div className="truncate" title={producto.descripcion}>
                        {producto.descripcion}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                      {producto.marca}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 text-center font-semibold">
                      {producto.cantidad}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 text-right font-mono">
                      ${producto.precio.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200 text-right font-semibold font-mono">
                      ${producto.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 border-gray-200">
                      <input
                        type="text"
                        value={producto.comentario}
                        onChange={(e) => handleComentarioChange(producto.id, e.target.value)}
                        placeholder="Agregar comentario..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">Resumen del Documento</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{productos.length}</div>
              <div className="text-sm text-gray-600">Productos Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{productosConComentarios}</div>
              <div className="text-sm text-gray-600">Con Comentarios</div>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">${totalGeneral.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </div>
          </div>
        </div>

        {/* Información adicional si hay comentarios */}
        {productosConComentarios > 0 && (
          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Nota:</strong> Hay {productosConComentarios} producto(s) con comentarios. 
              Recuerda guardar el documento para conservar los cambios.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DetalleDocumentoView