import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LinkRepository } from '@/chrome/link_repository'

describe('LinkRepository', () => {
    let fetchMock: ReturnType<typeof vi.fn>
    let mockStorageGet: ReturnType<typeof vi.fn>

    beforeEach(() => {
        fetchMock = vi.fn()
        mockStorageGet = vi.fn().mockResolvedValue({ auth_token: '' })
        vi.stubGlobal('fetch', fetchMock)
        vi.stubGlobal('chrome', {
            storage: { local: { get: mockStorageGet } },
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    describe('getLinks API contract', () => {
        it('sends a POST request to everypost.in/api/links', async () => {
            fetchMock.mockResolvedValue({
                status: 200,
                json: async () => ({ links: [], domain: true }),
            })

            const repo = new LinkRepository()
            await new Promise<void>((resolve) => {
                repo.getLinks('https://example.com/page', resolve)
            })

            expect(fetchMock).toHaveBeenCalledOnce()
            const [url, init] = fetchMock.mock.calls[0]
            expect(url).toBe('https://everypost.in/api/links')
            expect(init.method).toBe('POST')
        })

        it('sends the url as a form-encoded body param', async () => {
            fetchMock.mockResolvedValue({
                status: 200,
                json: async () => ({ links: [], domain: true }),
            })

            const targetUrl = 'https://example.com/some-page'
            const repo = new LinkRepository()
            await new Promise<void>((resolve) => {
                repo.getLinks(targetUrl, resolve)
            })

            const [, init] = fetchMock.mock.calls[0]
            expect(init.body).toBeInstanceOf(URLSearchParams)
            expect((init.body as URLSearchParams).get('url')).toBe(targetUrl)
        })

        it('sets Content-Type to application/x-www-form-urlencoded', async () => {
            fetchMock.mockResolvedValue({
                status: 200,
                json: async () => ({ links: [], domain: true }),
            })

            const repo = new LinkRepository()
            await new Promise<void>((resolve) => {
                repo.getLinks('https://example.com/page', resolve)
            })

            const [, init] = fetchMock.mock.calls[0]
            expect((init.headers as Headers).get('Content-Type')).toBe(
                'application/x-www-form-urlencoded'
            )
        })

        it('includes Authorization header when auth token is present', async () => {
            mockStorageGet.mockResolvedValue({ auth_token: 'mytoken123' })
            fetchMock.mockResolvedValue({
                status: 200,
                json: async () => ({ links: [], domain: true }),
            })

            const repo = new LinkRepository()
            await new Promise<void>((resolve) => {
                repo.getLinks('https://example.com/page', resolve)
            })

            const [, init] = fetchMock.mock.calls[0]
            expect((init.headers as Headers).get('Authorization')).toBe('Bearer mytoken123')
        })
    })
})
