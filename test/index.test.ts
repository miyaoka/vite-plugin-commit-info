import { afterEach, describe, expect, it } from 'vitest'
import { commitInfoPlugin } from '../src'

describe('commitInfoPlugin', () => {
  const plugin = commitInfoPlugin()
  const resolveId = plugin.resolveId as (id: string) => string | undefined
  const load = plugin.load as (id: string) => string | undefined

  it('has correct plugin name', () => {
    expect(plugin.name).toBe('vite-plugin-commit-info')
  })

  describe('resolveId', () => {
    it('resolves virtual:commit-info', () => {
      const result = resolveId('virtual:commit-info')
      expect(result).toBe('\0virtual:commit-info')
    })

    it('returns undefined for other ids', () => {
      const result = resolveId('other-module')
      expect(result).toBeUndefined()
    })
  })

  describe('load', () => {
    it('returns undefined for other ids', () => {
      const result = load('other-module')
      expect(result).toBeUndefined()
    })
  })
})

describe('commitInfoPlugin with real git', () => {
  afterEach(() => {
    delete process.env.COMMIT_HASH
    delete process.env.COMMIT_DATE
  })

  it('loads commit info from actual git repository', () => {
    const plugin = commitInfoPlugin()
    const load = plugin.load as (id: string) => string | undefined

    const result = load('\0virtual:commit-info')

    // Contains 40-character hex hash
    expect(result).toMatch(/hash: "[0-9a-f]{40}"/)
    // Contains positive integer timestamp
    expect(result).toMatch(/date: \d+/)
  })

  it('uses env vars over git commands', () => {
    process.env.COMMIT_HASH = 'env-hash-abc123'
    process.env.COMMIT_DATE = '1700000000'

    const plugin = commitInfoPlugin()
    const load = plugin.load as (id: string) => string | undefined

    const result = load('\0virtual:commit-info')

    expect(result).toContain('"env-hash-abc123"')
    expect(result).toContain('1700000000')
  })
})
