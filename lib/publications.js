

// export async function getFeaturedPublications() {
//     const res = await fetch("https://wedroneu.in/index.php?rest_route=/wp/v2/publication&per_page=5&page=1")
//     const publicationsData = await res.json()
    
//     extractPublicationData(publicationsData[0])

//     return []
// }

// // GET DIRECTLY ALL DATA FROM MELIESEARCH

// function extractPublicationData(rawPublicationData) {
//     return {
//         "slug": rawPublicationData["slug"],
//         "title": rawPublicationData["title"]["rendered"],
//         "featuredMedia": await getFeaturedImage(rawPublicationData["_links"]["wp:featuredmedia"][0]["href"], "medium"),
//         "themes": await getThemes(rawPublicationData["wp:term"][1]["href"])
//     }
// }


// // imageType => medium, thumbnail, full
// async function getFeaturedImage(url, imageType="full") {
//     const res = await fetch(url)
//     return res.json()["media_details"]["sizes"][imageType]["source_url"]
// }

// async function getThemes(url) {
//     const res = await fetch(url)
//     return res.json()["media_details"]["sizes"][imageType]["source_url"]
// }