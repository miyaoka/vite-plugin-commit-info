import { describe, expect, it, vi } from 'vitest'

// Simulate cases where git command fails.
// execSync throws an exception in these situations:
// - git is not installed
// - executed outside a git repository
// - no commits exist (freshly initialized repository)
// - .git directory is missing (e.g., Docker build without .git)
vi.mock('node:child_process', () => ({
  execSync: vi.fn(() => {
    throw new Error('Command failed')
  }),
}))

describe('commitInfoPlugin when git fails', () => {
  it('returns fallback values', async () => {
    const { commitInfoPlugin } = await import('../src')
    const plugin = commitInfoPlugin()
    const load = plugin.load as (id: string) => string | undefined

    const result = load('\0virtual:commit-info')

    expect(result).toContain('"unknown"')
    expect(result).toContain('date: 0')
  })
})
