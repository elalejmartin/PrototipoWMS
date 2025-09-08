import React, { useState } from 'react'
import { CrearCarro } from '../types'
import { Plus, X, Printer } from 'lucide-react'

const CrearCarrosTab: React.FC = () => {
  const [carrosCreados, setCarrosCreados] = useState<CrearCarro[]>([])
  const [showCrearModal, setShowCrearModal] = useState(false)
  const [tipoCarroSeleccionado, setTipoCarroSeleccionado] = useState<'Multiple' | 'Mono'>('Multiple')
  const [tipoEntradaSalida, setTipoEntradaSalida] = useState<'Entrada' | 'Salida'>('Entrada')
  const [cantidadCarros, setCantidadCarros] = useState(1)
  
  // Contadores para generar IDs únicos
  const [contadorMultiple, setContadorMultiple] = useState(1)
  const [contadorMono, setContadorMono] = useState(1)

  const carrosSeleccionados = carrosCreados.filter(carro => carro.seleccionado)

  const generarCodigoCarro = (tipo: 'Multiple' | 'Mono', contador: number): string => {
    const prefijo = tipo === 'Multiple' ? 'M' : 'C'
    return `${prefijo}-${contador.toString().padStart(4, '0')}`
  }

  const handleCrearCarros = () => {
    const nuevosCarros: CrearCarro[] = []
    const fechaActual = new Date().toLocaleDateString('es-ES')
    
    for (let i = 0; i < cantidadCarros; i++) {
      const contador = tipoCarroSeleccionado === 'Multiple' ? contadorMultiple + i : contadorMono + i
      const codigo = generarCodigoCarro(tipoCarroSeleccionado, contador)
      
      nuevosCarros.push({
        id: `carro-${Date.now()}-${i}`,
        codigo,
        tipo: tipoCarroSeleccionado,
        tipoCarro: tipoEntradaSalida,
        fechaCreacion: fechaActual,
        estado: 'Creado',
        seleccionado: false
      })
    }

    setCarrosCreados(prev => [...prev, ...nuevosCarros])
    
    // Actualizar contadores
    if (tipoCarroSeleccionado === 'Multiple') {
      setContadorMultiple(prev => prev + cantidadCarros)
    } else {
      setContadorMono(prev => prev + cantidadCarros)
    }

    console.log('Carros creados:', nuevosCarros)
    
    alert(`✅ ${cantidadCarros} carro(s) tipo ${tipoCarroSeleccionado} (${tipoEntradaSalida}) creado(s) exitosamente:\n\n` +
          nuevosCarros.map(c => `• ${c.codigo}`).join('\n'))

    setShowCrearModal(false)
    setCantidadCarros(1)
  }

  const handleSelectAll = (checked: boolean) => {
    setCarrosCreados(prev => prev.map(carro => ({ ...carro, seleccionado: checked })))
  }

  const handleSelectCarro = (id: string) => {
    setCarrosCreados(prev => prev.map(carro => 
      carro.id === id ? { ...carro, seleccionado: !carro.seleccionado } : carro
    ))
  }

  const handleImprimirCarros = () => {
    if (carrosSeleccionados.length === 0) return

    const confirmar = window.confirm(
      `¿Imprimir códigos de barra para ${carrosSeleccionados.length} carro(s) seleccionado(s)?\n\n` +
      `Carros a imprimir:\n` +
      carrosSeleccionados.map(c => `• ${c.codigo} (${c.tipo} - ${c.tipoCarro})`).join('\n')
    )

    if (confirmar) {
      // Simular impresión - en la vida real aquí se conectaría con la impresora
      console.log('Enviando a imprimir:', carrosSeleccionados)
      
      // Crear ventana de impresión con códigos de barra
      const ventanaImpresion = window.open('', '_blank', 'width=800,height=600')
      
      if (ventanaImpresion) {
        const contenidoHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Impresión Códigos de Barra - Carros</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .carro-item { 
                border: 1px solid #ccc; 
                margin: 15px 0; 
                padding: 15px; 
                page-break-inside: avoid;
                text-align: center;
              }
              .codigo { 
                font-size: 24px; 
                font-weight: bold; 
                font-family: 'Courier New', monospace;
                margin: 10px 0;
              }
              .barcode { 
                font-family: 'Libre Barcode 39', cursive;
                font-size: 48px;
                letter-spacing: 2px;
                margin: 10px 0;
              }
              .info { font-size: 14px; color: #666; }
              @media print {
                body { margin: 0; }
                .carro-item { margin: 10px 0; }
              }
            </style>
          </head>
          <body>
            <h2>Códigos de Barra - Carros Creados</h2>
            <p>Fecha de impresión: ${new Date().toLocaleString('es-ES')}</p>
            ${carrosSeleccionados.map(carro => `
              <div class="carro-item">
                <div class="codigo">${carro.codigo}</div>
                <div class="barcode">*${carro.codigo}*</div>
                <div class="info">Tipo: ${carro.tipo} - ${carro.tipoCarro} | Creado: ${carro.fechaCreacion}</div>
              </div>
            `).join('')}
          </body>
          </html>
        `
        
        ventanaImpresion.document.write(contenidoHTML)
        ventanaImpresion.document.close()
        
        // Abrir diálogo de impresión automáticamente
        setTimeout(() => {
          ventanaImpresion.print()
        }, 500)
      }

      alert(`🖨️ Enviando ${carrosSeleccionados.length} código(s) de barra a la impresora.\n\nSe ha abierto una ventana con los códigos para imprimir.`)
    }
  }

  const handleCloseModal = () => {
    setShowCrearModal(false)
    setCantidadCarros(1)
    setTipoCarroSeleccionado('Multiple')
    setTipoEntradaSalida('Entrada')
  }

  const todosSeleccionados = carrosCreados.length > 0 && carrosCreados.every(carro => carro.seleccionado)

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Carros</h2>
        
        {/* Botón para Crear Carros */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setShowCrearModal(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nuevos Carros
          </button>
          
          {carrosCreados.length > 0 && (
            <button
              onClick={handleImprimirCarros}
              disabled={carrosSeleccionados.length === 0}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md ${
                carrosSeleccionados.length === 0
                  ? 'text-gray-400 bg-gray-200 cursor-not-allowed'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              } transition-colors duration-200`}
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimir Seleccionados ({carrosSeleccionados.length})
            </button>
          )}
        </div>

        {/* Tabla de Carros Creados */}
        {carrosCreados.length > 0 && (
          <div className="border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Carros Creados ({carrosCreados.length})</h3>
            </div>
            
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
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Código</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Tipo</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Operación</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-r border-gray-200">Fecha Creación</th>
                  <th className="px-4 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {carrosCreados.map((carro) => (
                  <tr key={carro.id} className="hover:bg-gray-50">
                    <td className="px-4 py-5 border-r border-gray-200">
                      <input
                        type="checkbox"
                        checked={carro.seleccionado}
                        onChange={() => handleSelectCarro(carro.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-4 py-5 text-sm font-bold text-gray-900 border-r border-gray-200 font-mono text-lg">
                      {carro.codigo}
                    </td>
                    <td className="px-4 py-5 border-r border-gray-200">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        carro.tipo === 'Multiple' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {carro.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-5 border-r border-gray-200">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        carro.tipoCarro === 'Entrada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {carro.tipoCarro}
                      </span>
                    </td>
                    <td className="px-4 py-5 text-sm text-gray-900 border-r border-gray-200">{carro.fechaCreacion}</td>
                    <td className="px-4 py-5">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        carro.estado === 'Creado' ? 'bg-green-100 text-green-800' :
                        carro.estado === 'En Uso' ? 'bg-yellow-100 text-yellow-800' :
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
        )}

        {/* Mensaje cuando no hay carros */}
        {carrosCreados.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <Plus className="h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay carros creados</h3>
            <p className="text-gray-500 mb-4">Comienza creando nuevos carros para el sistema WMS</p>
          </div>
        )}

        {/* Modal para Crear Carros */}
        {showCrearModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Crear Nuevos Carros</h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tipoEntradaSalida" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Operación
                    </label>
                    <select
                      id="tipoEntradaSalida"
                      value={tipoEntradaSalida}
                      onChange={(e) => setTipoEntradaSalida(e.target.value as 'Entrada' | 'Salida')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Entrada">Entrada</option>
                      <option value="Salida">Salida</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tipoCarro" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Carro
                    </label>
                    <select
                      id="tipoCarro"
                      value={tipoCarroSeleccionado}
                      onChange={(e) => setTipoCarroSeleccionado(e.target.value as 'Multiple' | 'Mono')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Multiple">Multiple (Código: M-XXXX)</option>
                      <option value="Mono">Mono (Código: C-XXXX)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="cantidadCarros" className="block text-sm font-medium text-gray-700 mb-2">
                      Cantidad de Carros
                    </label>
                    <input
                      type="number"
                      id="cantidadCarros"
                      min="1"
                      max="50"
                      value={cantidadCarros}
                      onChange={(e) => setCantidadCarros(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Preview:</strong> Se crearán {cantidadCarros} carro(s) tipo {tipoCarroSeleccionado} para {tipoEntradaSalida}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Próximos códigos: {tipoCarroSeleccionado === 'Multiple' 
                        ? `M-${contadorMultiple.toString().padStart(4, '0')}` 
                        : `C-${contadorMono.toString().padStart(4, '0')}`}
                      {cantidadCarros > 1 && ` hasta ${tipoCarroSeleccionado === 'Multiple' 
                        ? `M-${(contadorMultiple + cantidadCarros - 1).toString().padStart(4, '0')}` 
                        : `C-${(contadorMono + cantidadCarros - 1).toString().padStart(4, '0')}`}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCrearCarros}
                    disabled={cantidadCarros < 1}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                      cantidadCarros >= 1
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Crear {cantidadCarros} Carro(s)
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

export default CrearCarrosTab