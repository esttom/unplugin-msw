interface Import {
  from: string
  imported: string[]
  local?: string
}

interface Export {
  local: string
  value: string
}

export class Code {
  private imports: Import[] = []
  private exports: Export[] = []

  addImport(i: Import) {
    this.imports.push(i)
  }

  addExport(e: Export) {
    this.exports.push(e)
  }

  generateCode() {
    const createImportMember = (i: Import) => i.local ? i.local : `{ ${i.imported.join(', ')} }`
    const importCode = this.imports.map(i => `import ${createImportMember(i)} from \"${i.from}\";`).join('\n')
    const exportCode = this.exports.map(e => `export const ${e.local} = ${e.value}`).join('\n')

    return `
${importCode}

${exportCode}
    `
  }
}
