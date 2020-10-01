

const MeiliSearch = require('meilisearch')

const client = new MeiliSearch({ host: 'https://search.wedroneu.in', apiKey: "c41a7ff3dce6736c955d01af935c24b39bc6c5897b9cf5c9db97edd75a0f733f" })

const index = client.getIndex('publications')


export async function getFeaturedPublications() {
    const search = await index.search(null, {
        filters: 'featured = true'
      })

    return search.hits
}
