import React, { useState } from 'react'
import { TabType } from './types'
import { PedidoProvider, usePedidoContext } from './contexts/PedidoContext'
import Navbar from './components/Navbar'
import RecepcionTab from './components/RecepcionTab'
import PedidosLiberadosTab from './components/PedidosLiberadosTab'
import GestionCarrosTab from './components/GestionCarrosTab'
import CarrosPendientesTab from './components/CarrosPendientesTab'
import DiferenciasTab from './components/DiferenciasTab'
import CrearCarrosTab from './components/CrearCarrosTab'

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('recepcion')
  const { pedidoSeleccionado, estaGestionando } = usePedidoContext()

  // Redireccionar automáticamente si está en un tab restringido sin pedido gestionado
  const restrictedTabs = ['gestionCarros', 'carrosPendientes', 'diferencias']
  React.useEffect(() => {
    if (!estaGestionando && restrictedTabs.includes(activeTab)) {
      setActiveTab('recepcion')
    }
  }, [estaGestionando, activeTab])

  const tabs = [
    { id: 'recepcion' as TabType, label: 'Recepción' },
    { id: 'crearCarros' as TabType, label: 'Crear Carros' },
    { id: 'pedidosLiberados' as TabType, label: 'Pedidos Liberados' },
    { id: 'gestionCarros' as TabType, label: 'Gestión de Carros' },
    { id: 'carrosPendientes' as TabType, label: 'Carros Pendientes de Ubicar' },
    { id: 'diferencias' as TabType, label: 'Diferencias' },
  ]

  const renderTabContent = () => {
    // Verificar si el tab actual requiere un pedido gestionado
    const restrictedTabs = ['gestionCarros', 'carrosPendientes', 'diferencias']
    if (restrictedTabs.includes(activeTab) && !estaGestionando) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            🔒
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
          <p className="text-gray-500 mb-4">
            Para acceder a este tab, primero debes seleccionar "Gestionar" en un pedido desde la pestaña "Pedidos Liberados".
          </p>
          <button
            onClick={() => setActiveTab('pedidosLiberados')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Ir a Pedidos Liberados
          </button>
        </div>
      )
    }

    switch (activeTab) {
      case 'recepcion':
        return <RecepcionTab />
      case 'pedidosLiberados':
        return <PedidosLiberadosTab />
      case 'gestionCarros':
        return <GestionCarrosTab />
      case 'carrosPendientes':
        return <CarrosPendientesTab />
      case 'diferencias':
        return <DiferenciasTab />
      case 'crearCarros':
        return <CrearCarrosTab />
      default:
        return <RecepcionTab />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        currentUser="Juan Pérez" 
        onRecepcionClick={() => setActiveTab('recepcion')} 
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema WMS</h1>
          {estaGestionando && pedidoSeleccionado && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                📋 <strong>Gestionando Pedido:</strong> {pedidoSeleccionado.nroDocumento} - {pedidoSeleccionado.tipoDocumento}
                <span className="ml-4 text-blue-600">Almacén: {pedidoSeleccionado.almacen}</span>
              </p>
            </div>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              // Tabs que requieren un pedido gestionado
              const requiresPedido = ['gestionCarros', 'carrosPendientes', 'diferencias'].includes(tab.id)
              const isDisabled = requiresPedido && !estaGestionando
              
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    isDisabled
                      ? 'border-transparent text-gray-300 cursor-not-allowed'
                      : activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  title={isDisabled ? 'Selecciona "Gestionar" en un pedido para acceder a este tab' : ''}
                >
                  {tab.label}
                  {isDisabled && (
                    <span className="ml-1 text-xs">🔒</span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <PedidoProvider>
      <AppContent />
    </PedidoProvider>
  )
}

export default App