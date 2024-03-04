interface Import {
  from: string
  imported: string[]
  local?: string
}

interface Export {
  local: string
  value: string
}

interface HandlerImport {
  from: string
}

export class Code {
  private imports: Import[] = []
  private handlerImports: HandlerImport[] = []
  private exports: Export[] = []

  addImport(i: Import) {
    this.imports.push(i)
  }

  addExport(e: Export) {
    this.exports.push(e)
  }

  addHandlerImport(h: HandlerImport) {
    this.handlerImports.push(h)
  }

  generateCode() {
    const createImportMember = (i: Import) => i.local ? i.local : `{ ${i.imported.join(', ')} }`
    const importCode = this.imports.map(i => `import ${createImportMember(i)} from \"${i.from}\";`).join('\n')
    const handlerImportCode = this.handlerImports.map((h, i) => `import _h${i} from \"${h.from}\";`).join('\n')
    const handlerDefCode = this.handlerImports.map((_, i) => `..._h${i}`).join(', ')
    const exportCode = this.exports.map(e => `export const ${e.local} = ${e.value}`).join('\n')

    return `
${importCode}
${handlerImportCode}

const handlers = [${handlerDefCode}]

${exportCode}
    `
  }
}
