/**
 * CONTEXTO: AuthContext
 * =====================
 * Guarda o login do painel e o deixa disponível em qualquer página:
 *
 *   const { user, isAdmin, token, login, logout, run, refreshUser } = useAuth()
 *
 * - user = { id, email, role, developerId, developer }
 *     role 'admin'  = equipe da Trevo (isAdmin = true)
 *     role 'studio' = login de um estúdio (developer = { id, name })
 *
 * - O token fica no sessionStorage: some quando a aba do navegador é fechada.
 * - run(fn): chama a API do painel com o token; se o login vencer (401),
 *   sai automaticamente e o ProtectedRoute leva de volta para /login.
 * - refreshUser(): busca o login de novo (ex.: depois que o estúdio muda o
 *   próprio nome, para o menu mostrar o nome novo).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'

const STORAGE_KEY = 'trevo-token'
const AuthContext = createContext(null)

// sessionStorage pode falhar em modo privado; por isso o try/catch
const storage = {
  get: () => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  },
  set: (value) => {
    try {
      if (value) sessionStorage.setItem(STORAGE_KEY, value)
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* sem armazenamento: o login dura até recarregar a página */
    }
  },
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(storage.get)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(Boolean(token)) // conferindo o token salvo

  const logout = useCallback(() => {
    storage.set('')
    setToken('')
    setUser(null)
  }, [])

  // Ao abrir o site com um token salvo, confere se ele ainda vale
  useEffect(() => {
    if (!token || user) {
      setChecking(false)
      return
    }
    api
      .me(token)
      .then((data) => setUser(data.user))
      .catch(() => logout())
      .finally(() => setChecking(false))
  }, [token, user, logout])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    storage.set(data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return
    const data = await api.me(token)
    setUser(data.user)
  }, [token])

  const run = useCallback(
    async (fn) => {
      try {
        return await fn(token)
      } catch (error) {
        if (error.status === 401) logout()
        throw error
      }
    },
    [token, logout],
  )

  const value = useMemo(
    () => ({
      token,
      user,
      checking,
      isLoggedIn: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      logout,
      run,
      refreshUser,
    }),
    [token, user, checking, login, logout, run, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}