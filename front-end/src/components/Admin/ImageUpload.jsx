/**
 * COMPONENTE: ImageUpload
 * =======================
 * Campo de imagem do painel: mostra a prévia, envia o arquivo para a API
 * e devolve o caminho salvo ("/uploads/...") pelo onChange.
 *
 *   [ prévia ]  [Escolher imagem] [Remover]
 *
 * Props:
 * - label:    texto do campo
 * - value:    caminho atual da imagem ('' = sem imagem)
 * - onChange: recebe o novo caminho
 * - small:    versão menor (fotos de integrantes)
 */

import { useId, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import './css/Admin.css'

export default function ImageUpload({ label, value, onChange, small = false }) {
  const { run } = useAuth()
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const id = useId()

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite escolher o mesmo arquivo de novo
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem pode ter no máximo 5 MB.')
      return
    }
    setError('')
    setSending(true)
    try {
      const path = await run((token) => api.admin.uploadImage(token, file))
      onChange(path)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={`image-upload ${small ? 'image-upload--small' : ''}`}>
      <span className="admin-label">{label}</span>
      <div className="image-upload-row">
        <div className="image-upload-preview">
          {value ? <img src={imageUrl(value)} alt="" /> : <span>sem imagem</span>}
        </div>
        <div className="image-upload-buttons">
          <label htmlFor={id} className="admin-button admin-button--light">
            {sending ? 'Enviando...' : value ? 'Trocar' : 'Escolher imagem'}
          </label>
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="visually-hidden"
            onChange={handleFile}
            disabled={sending}
          />
          {value && (
            <button type="button" className="admin-button admin-button--ghost" onClick={() => onChange('')}>
              Remover
            </button>
          )}
        </div>
      </div>
      {error && <p className="admin-field-error">{error}</p>}
    </div>
  )
}
