/**
 * COMPONENTE: SocialIcon
 * ======================
 * Ícone de uma rede social / plataforma / contato, escolhido sozinho
 * pelo NOME da rede ou pelo LINK. Usado dentro das bolinhas do Header,
 * do Footer e do card do estúdio no blog.
 *
 *   <SocialIcon label="Instagram" url="https://instagram.com/trevo" />
 *   <SocialIcon label="Rede" url="https://store.steampowered.com/..." />  -> Steam (pelo link)
 *   <SocialIcon label="E-mail" url="mailto:contato@..." />                -> envelope
 *
 * A cor do ícone vem do CSS de quem usa (o ícone pega o "color" da bolinha).
 * O tamanho também (regra "svg" dentro da bolinha).
 *
 * Os ícones são da biblioteca react-icons (pacote Bootstrap Icons, "bs").
 * Instalar uma vez na pasta front-end:  npm install react-icons
 * Lista de ícones: https://react-icons.github.io/react-icons/icons/bs/
 *
 * Rede que não está na lista abaixo aparece com o ícone de link (BsLink45Deg).
 * Para incluir uma nova: importe o ícone e adicione uma linha em NETWORKS.
 */

// ===============================================
// IMPORTAÇÕES
// ===============================================

import {
  BsDiscord,
  BsEnvelopeFill,
  BsFacebook,
  BsGithub,
  BsGlobe2,
  BsInstagram,
  BsLink45Deg,
  BsLinkedin,
  BsNintendoSwitch,
  BsSteam,
  BsTelephoneFill,
  BsTiktok,
  BsTwitch,
  BsTwitterX,
  BsWhatsapp,
  BsXbox,
  BsYoutube,
} from 'react-icons/bs'

// ===============================================
// REDES CONHECIDAS
// ===============================================
// names:   nomes aceitos no campo "Rede" (sem acento, maiúscula ou espaço)
// domains: sites que identificam a rede pelo link

const NETWORKS = [
  { icon: BsSteam, names: ['steam'], domains: ['steampowered.com', 'steamcommunity.com'] },
  { icon: BsXbox, names: ['xbox'], domains: ['xbox.com'] },
  { icon: BsNintendoSwitch, names: ['nintendo', 'switch', 'nintendoswitch'], domains: ['nintendo.com'] },
  { icon: BsInstagram, names: ['instagram', 'insta'], domains: ['instagram.com'] },
  { icon: BsTwitterX, names: ['x', 'twitter'], domains: ['x.com', 'twitter.com'] },
  { icon: BsYoutube, names: ['youtube'], domains: ['youtube.com', 'youtu.be'] },
  { icon: BsDiscord, names: ['discord'], domains: ['discord.gg', 'discord.com'] },
  { icon: BsTiktok, names: ['tiktok'], domains: ['tiktok.com'] },
  { icon: BsTwitch, names: ['twitch'], domains: ['twitch.tv'] },
  { icon: BsLinkedin, names: ['linkedin'], domains: ['linkedin.com'] },
  { icon: BsGithub, names: ['github'], domains: ['github.com'] },
  { icon: BsFacebook, names: ['facebook'], domains: ['facebook.com'] },
  { icon: BsWhatsapp, names: ['whatsapp', 'zap'], domains: ['wa.me', 'whatsapp.com'] },
  { icon: BsEnvelopeFill, names: ['email', 'mail'], protocol: 'mailto:' },
  { icon: BsTelephoneFill, names: ['telefone', 'phone', 'tel', 'celular'], protocol: 'tel:' },
  { icon: BsGlobe2, names: ['site', 'website', 'web'] },
]

// ===============================================
// FUNÇÕES AUXILIARES
// ===============================================

/** "E-mail" -> "email" | "Nintendo Switch" -> "nintendoswitch" */
const normalize = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tira os acentos
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

/** Domínio do link, sem "www." ("" se o link não for de site) */
function hostOf(url = '') {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

/** Escolhe o ícone: primeiro pelo nome, depois pelo link */
export function findSocialIcon(label, url = '') {
  const name = normalize(label)
  const byName = NETWORKS.find((n) => n.names.includes(name))
  if (byName) return byName.icon

  const host = hostOf(url)
  const byLink = NETWORKS.find(
    (n) =>
      (n.protocol && url.startsWith(n.protocol)) ||
      (host && n.domains?.some((d) => host === d || host.endsWith(`.${d}`))),
  )
  return byLink ? byLink.icon : BsLink45Deg
}

// ===============================================
// COMPONENTE PRINCIPAL
// ===============================================

export default function SocialIcon({ label, url, className = '' }) {
  const Icon = findSocialIcon(label, url)
  // Só enfeite: o nome da rede vai no aria-label do link em volta
  return <Icon className={className} aria-hidden="true" focusable="false" />
}
