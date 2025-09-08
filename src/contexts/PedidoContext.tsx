import React, { createContext, useContext, useState, ReactNode } from 'react'
import { PedidoLiberado } from '../types'

interface PedidoContextType {
  pedidoSeleccionado: PedidoLiberado | null
  setPedidoSeleccionado: (pedido: PedidoLiberado | null) => void
  estaGestionando: boolean
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined)

interface PedidoProviderProps {
  children: ReactNode
}

export const PedidoProvider: React.FC<PedidoProviderProps> = ({ children }) => {
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<PedidoLiberado | null>(null)

  const estaGestionando = pedidoSeleccionado !== null

  return (
    <PedidoContext.Provider value={{
      pedidoSeleccionado,
      setPedidoSeleccionado,
      estaGestionando
    }}>
      {children}
    </PedidoContext.Provider>
  )
}

export const usePedidoContext = () => {
  const context = useContext(PedidoContext)
  if (context === undefined) {
    throw new Error('usePedidoContext must be used within a PedidoProvider')
  }
  return context
}