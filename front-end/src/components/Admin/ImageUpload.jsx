/**
 * COMPONENTE: ImageUpload
 * =======================
 * Campo de imagem do painel: arraste o arquivo para a área ou clique nela.
 * Envia o arquivo para a API e devolve o caminho salvo ("/uploads/...")
 * pelo onChange.
 *
 *   Capa
 *   ┌ - - - - - - - - - ┐
 *   |   ☁ Arraste ou    |   <- vazia
 *   |      clique       |
 *   └ - - - - - - - - - ┘
 *   [imagem]  Trocar · Remover   <- com imagem
 *
 * Props:
 * - label:    texto do campo
 * - value:    caminho atual da imagem ('' = sem imagem)
 * - onChange: recebe o novo caminho
 * - small:    versão menor e quadrada (fotos, logotipo, personagens)
 * - contain:  mostra a imagem inteira, sem cortar (logotipo, PNG recortado)
 */

import { useId, useState } from 'react'
import { BsCloudArrowUp } from 'react-icons/bs'
import { useAuth } from '../../context/AuthContext'
import { api, imageUrl } from '../../services/api'
import './css/Admin.css'

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB (igual ao back-end)

export default function ImageUpload({ label, value, onChange, small = false, contain = false }) {
  const { run } = useAuth()
  const [sending, setSending] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const id = useId()
  const labelId = `${id}-rotulo`

  // ---------- Envia o arquivo ----------
  const upload = async (file) => {
    if (!ACCEPT.includes(file.type)) {
      setError('Use uma imagem JPG, PNG, WEBP ou GIF.')
      return
    }
    if (file.size > MAX_SIZE) {
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

  // Clicou e escolheu um arquivo
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permite escolher o mesmo arquivo de novo
    if (file) upload(file)
  }

  // ---------- Arrastar e soltar ----------
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    if (!dragging) setDragging(true)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file && !sending) upload(file)
  }

  const cls = [
    'admin-upload',
    small && 'admin-upload--small',
    contain && 'admin-upload--contain',
    value && 'is-filled',
    dragging && 'is-dragging',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls}>
      <span className="admin-label" id={labelId}>{label}</span>

      <div className="admin-upload-zone" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {value ? (
          <img className="admin-upload-img" src={imageUrl(value)} alt="" />
        ) : (
          <span className="admin-upload-empty" aria-hidden="true">
            <BsCloudArrowUp />
            <strong>{dragging ? 'Pode soltar' : 'Arraste ou clique'}</strong>
            <span>JPG, PNG, WEBP ou GIF · até 5 MB</span>
          </span>
        )}

        {/* A área inteira abre a escolha de arquivo */}
        <label htmlFor={id} className="admin-upload-hit" aria-hidden="true"></label>
        <input
          id={id}
          type="file"
          accept={ACCEPT.join(',')}
          className="visually-hidden"
          onChange={handleFile}
          disabled={sending}
          aria-labelledby={labelId}
        />

        {sending && <span className="admin-upload-sending">Enviando...</span>}
      </div>

      {value && (
        <div className="admin-upload-actions">
          <label htmlFor={id} className="admin-text-btn">Trocar</label>
          <button type="button" className="admin-text-btn admin-text-btn--danger" onClick={() => onChange('')}
            aria-label={`Remover imagem: ${label}`}>
            Remover
          </button>
        </div>
      )}

      {error && <p className="admin-field-error" role="alert">{error}</p>}
    </div>
  )
}