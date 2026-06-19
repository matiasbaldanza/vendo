#!/usr/bin/env tsx
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, 'content/products')
const PUBLIC_DIR = path.join(ROOT, 'public/products')

function slugify(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function ensureDirs() {
  fs.mkdirSync(CONTENT_DIR, { recursive: true })
  fs.mkdirSync(PUBLIC_DIR, { recursive: true })
}

function getProductPath(slug: string) {
  return path.join(CONTENT_DIR, `${slug}.md`)
}

function loadProduct(slug: string) {
  const filePath = getProductPath(slug)
  if (!fs.existsSync(filePath)) {
    console.error(`Producto no encontrado: ${slug}`)
    process.exit(1)
  }
  const raw = fs.readFileSync(filePath, 'utf8')
  return { filePath, ...matter(raw) }
}

function saveProduct(slug: string, data: Record<string, unknown>, body: string) {
  const content = matter.stringify(body, data)
  fs.writeFileSync(getProductPath(slug), content)
}

function parseArgs(args: string[]) {
  const flags: Record<string, string | boolean> = {}
  const positional: string[] = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg.startsWith('--')) {
      const key = arg.slice(2)
      const next = args[i + 1]
      if (next && !next.startsWith('--')) {
        flags[key] = next
        i++
      } else {
        flags[key] = true
      }
    } else {
      positional.push(arg)
    }
  }

  return { flags, positional }
}

function copyImages(slug: string, sources: string[]) {
  const destDir = path.join(PUBLIC_DIR, slug)
  fs.mkdirSync(destDir, { recursive: true })

  const copied: string[] = []
  for (const src of sources) {
    if (!fs.existsSync(src)) {
      console.warn(`Imagen no encontrada: ${src}`)
      continue
    }
    const filename = path.basename(src)
    fs.copyFileSync(src, path.join(destDir, filename))
    copied.push(filename)
  }
  return copied
}

function cmdAdd(flags: Record<string, string | boolean>) {
  const title = flags.title as string
  const price = flags.price as string

  if (!title || !price) {
    console.error('Uso: vendo add --title "Título" --price 50000 [--slug silla] [--tags tag1,tag2] [--images img1.jpg,img2.jpg]')
    process.exit(1)
  }

  const slug = (flags.slug as string) || slugify(title)
  if (!slug) {
    console.error('No se pudo generar un slug válido')
    process.exit(1)
  }

  if (fs.existsSync(getProductPath(slug))) {
    console.error(`Ya existe un producto con slug: ${slug}`)
    process.exit(1)
  }

  const tags = flags.tags ? String(flags.tags).split(',').map(t => t.trim()).filter(Boolean) : []
  const imageSources = flags.images ? String(flags.images).split(',').map(t => t.trim()) : []
  const copied = copyImages(slug, imageSources)

  const images = copied.map((filename, index) => ({
    path: `/products/${slug}/${filename}`,
    alt: title,
    order: index,
  }))

  const data = {
    title,
    description: (flags.description as string) ?? '',
    price: Number(price),
    currency: (flags.currency as string) ?? 'ARS',
    status: 'available',
    tags,
    images,
    primaryImage: images[0]?.path ?? '',
    specs: {},
    externalLinks: [],
    hidden: false,
    createdAt: new Date().toISOString(),
  }

  const body = (flags.body as string) ?? ''
  saveProduct(slug, data, body)
  console.log(`Producto creado: ${slug}`)
  console.log(`URL: /${slug}`)
}

function cmdEdit(flags: Record<string, string | boolean>, positional: string[]) {
  const slug = positional[0] || (flags.slug as string)
  if (!slug) {
    console.error('Uso: vendo edit <slug> [--title ...] [--price ...] [--description ...] [--tags a,b]')
    process.exit(1)
  }

  const { data, content } = loadProduct(slug)

  if (flags.title) data.title = flags.title
  if (flags.price) data.price = Number(flags.price)
  if (flags.description) data.description = flags.description
  if (flags.currency) data.currency = flags.currency
  if (flags.tags) data.tags = String(flags.tags).split(',').map(t => t.trim()).filter(Boolean)
  if (flags.body) {
    saveProduct(slug, data, flags.body as string)
    console.log(`Producto actualizado: ${slug}`)
    return
  }

  if (flags.images) {
    const copied = copyImages(slug, String(flags.images).split(',').map(t => t.trim()))
    const newImages = copied.map((filename, index) => ({
      path: `/products/${slug}/${filename}`,
      alt: data.title as string,
      order: index,
    }))
    data.images = [...(Array.isArray(data.images) ? data.images : []), ...newImages]
    if (!data.primaryImage && newImages[0]) data.primaryImage = newImages[0].path
  }

  saveProduct(slug, data, content)
  console.log(`Producto actualizado: ${slug}`)
}

function cmdStatus(positional: string[]) {
  const [slug, status] = positional
  if (!slug || !status) {
    console.error('Uso: vendo status <slug> <available|reserved|sold>')
    process.exit(1)
  }

  if (!['available', 'reserved', 'sold'].includes(status)) {
    console.error('Status inválido. Usar: available, reserved, sold')
    process.exit(1)
  }

  const { data, content } = loadProduct(slug)
  data.status = status
  saveProduct(slug, data, content)
  console.log(`${slug} → ${status}`)
}

function cmdHide(positional: string[]) {
  const slug = positional[0]
  if (!slug) {
    console.error('Uso: vendo hide <slug>')
    process.exit(1)
  }

  const { data, content } = loadProduct(slug)
  data.hidden = true
  saveProduct(slug, data, content)
  console.log(`${slug} oculto`)
}

function cmdDelete(positional: string[]) {
  const slug = positional[0]
  if (!slug) {
    console.error('Uso: vendo delete <slug>')
    process.exit(1)
  }

  const filePath = getProductPath(slug)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  const imageDir = path.join(PUBLIC_DIR, slug)
  if (fs.existsSync(imageDir)) fs.rmSync(imageDir, { recursive: true })

  console.log(`${slug} eliminado`)
}

function cmdList() {
  ensureDirs()
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))

  if (files.length === 0) {
    console.log('No hay productos.')
    return
  }

  for (const file of files.sort()) {
    const slug = file.replace('.md', '')
    const { data } = matter(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8'))
    const hidden = data.hidden ? ' [oculto]' : ''
    console.log(`${slug.padEnd(24)} ${String(data.status).padEnd(10)} $${data.price}${hidden}`)
  }
}

function main() {
  ensureDirs()
  const [, , command, ...rest] = process.argv
  const { flags, positional } = parseArgs(rest)

  switch (command) {
    case 'add':
      cmdAdd(flags)
      break
    case 'edit':
      cmdEdit(flags, positional)
      break
    case 'status':
      cmdStatus(positional)
      break
    case 'hide':
      cmdHide(positional)
      break
    case 'delete':
      cmdDelete(positional)
      break
    case 'list':
      cmdList()
      break
    default:
      console.log(`Vendo CLI — gestión de productos

Comandos:
  add     --title "..." --price N [--slug] [--tags a,b] [--images path1,path2]
  edit    <slug> [--title] [--price] [--description] [--tags] [--images]
  status  <slug> <available|reserved|sold>
  hide    <slug>
  delete  <slug>
  list
`)
  }
}

main()
