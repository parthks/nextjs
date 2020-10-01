// Melisearch master key ==> NGRlMzcxN2Y5MDVmYzQ1MmU0Y2IwOTUx
// {"private":"14159eed3caaa76ec629eed80961591bd2d68b7f03260433b52e8480ed872051",
// 	"public":"c41a7ff3dce6736c955d01af935c24b39bc6c5897b9cf5c9db97edd75a0f733f"} 

// Python
// import meilisearch
// client = meilisearch.Client('http://127.0.0.1:7700', 'NGRlMzcxN2Y5MDVmYzQ1MmU0Y2IwOTUx')


const secret = "f6eed809eb36da52c6bfde04d6f8b687b4bbe720";

const http = require('http');

const MeiliSearch = require('meilisearch')

const client = new MeiliSearch({ host: 'http://127.0.0.1:7700', apiKey: 'NGRlMzcxN2Y5MDVmYzQ1MmU0Y2IwOTUx' })



    


function savePublicationData(data) {
    const post = data["post"]
    const taxonomies = data["taxonomies"]

    const postContent = {
        "id": post["ID"],
        "post_thumbnail": data["post_thumbnail"],
        "title": post["post_title"],
        "slug": post["post_name"],
        "description": data["post_meta"]["publication_description"],
        "featured": data["post_meta"]["featured_publication"][0] === "1",
        "organization_url": data["post_meta"]["publication_organization_url"] ? data["post_meta"]["publication_organization_url"][0] : '',
        "host_url": data["post_meta"]["publication_host_url"] ? data["post_meta"]["publication_host_url"][0] : '',
        "pub_year": data["post_meta"]["publication_date_year"] ? data["post_meta"]["publication_date_year"][0] : '',
        "pub_month": data["post_meta"]["publication_date_month"] ? data["post_meta"]["publication_date_month"][0] : '',
        "types": taxonomies["type"] ? Object.values(taxonomies["type"]).map(data => data.name) : [],
        "authors": taxonomies["authorr"] ? Object.values(taxonomies["authorr"]).map(data => data.name) : [],
        "organizations": taxonomies["organization"] ? Object.values(taxonomies["organization"]).map(data => data.name) : [],
        "category": taxonomies["category"] ? Object.values(taxonomies["category"]).map(data => data.name) : [],
        "themes": taxonomies["themes"] ? Object.values(taxonomies["themes"]).map(data => data.name) : [],
        "tags": taxonomies["tags"] ? Object.values(taxonomies["tags"]).map(data => data.name) : [],
        "sector": taxonomies["sector"] ? Object.values(taxonomies["sector"]).map(data => data.name) : [],
    }

    const pub_date = new Date(`${postContent["pub_month"]} ${postContent["pub_year"]}`)
    postContent["pub_date"] = pub_date.getTime()

    if (taxonomies["geographic_region"]) {
        postContent["geo_region"] = Object.values(taxonomies["geographic_region"]).map(data => data.name)
    } else if (taxonomies["country"]) {
        postContent["geo_region"] = Object.values(taxonomies["country"]).map(data => data.name)
    }

    console.log("UPDATED PUBLICATION!")
    client.getIndex('publications').addDocuments([postContent])
}

http.createServer(function (req, res) {

    req.on('data', function(chunk) {
        try {
            const data = JSON.parse(chunk.toString())
            if (data.api_key !== secret) {console.log("WRONG KEY"); return;}
            console.log("VERIFIED!")
            const post = data["post"]
            const action = post["post_status"] // "publish" else remove it
            const type = post["post_type"] // "publication"

            
                if (type === "publication") {
                    if (action === "publish") {
                        savePublicationData(data)
                    } else {
                        console.log("DELETED PUBLICATION!")
                        client.getIndex("publications").deleteDocument(post["ID"])
                    }
                }
        } catch {
            console.log("ERROR")
        }

        res.end()
                 
         
     });
 
 }).listen(8080);
 