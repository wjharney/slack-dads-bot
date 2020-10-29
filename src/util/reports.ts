import fse from 'fs-extra'
import path from 'path'

export const REPORTS = path.resolve(__dirname, '../../reports')

function guard(filename: string): void {
  if (path.basename(filename) !== filename) {
    throw new Error('Filename cannot be a path.')
  }
}

export async function exists(filename: string): Promise<boolean> {
  guard(filename)
  return await fse.pathExists(path.join(REPORTS, filename))
}

export function existsSync(filename: string): boolean {
  guard(filename)
  return fse.pathExistsSync(path.join(REPORTS, filename))
}

export async function read(filename: string, options?: string | fse.ReadOptions): Promise<any> {
  guard(filename)
  const file = path.join(REPORTS, filename)
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.json') {
    if (typeof options === 'string') {
      throw new TypeError('Options cannot be string for reading JSON file.')
    }
    return await fse.readJson(file, options)
  } else {
    if (options && typeof options !== 'string') {
      throw new TypeError('Options for plain files must be a string encoding.')
    }
    return await fse.readFile(file, options ?? 'utf8')
  }
}

export function readSync(filename: string, options?: string | fse.ReadOptions): any {
  guard(filename)
  const file = path.join(REPORTS, filename)
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.json') {
    if (typeof options === 'string') {
      throw new TypeError('Options cannot be string for reading JSON file.')
    }
    return fse.readJsonSync(file, options)
  } else {
    if (options && typeof options !== 'string') {
      throw new TypeError('Options for plain files must be a string encoding.')
    }
    return fse.readFileSync(file, options ?? 'utf8')
  }
}

export async function write(filename: string, data: unknown, options?: fse.WriteOptions): Promise<void> {
  guard(filename)
  const file = path.join(REPORTS, filename)
  if (typeof data === 'string') {
    await fse.writeFile(file, data, options ?? 'utf8')
  } else {
    await fse.writeJson(file, data, options ?? { encoding: 'utf8', spaces: 2 })
  }
}

export function writeSync(filename: string, data: unknown, options?: fse.WriteOptions): void {
  guard(filename)
  const file = path.join(REPORTS, filename)
  if (typeof data === 'string') {
    fse.writeFileSync(file, data, options ?? 'utf8')
  } else {
    fse.writeJsonSync(file, data, options ?? { encoding: 'utf8', spaces: 2 })
  }
}
