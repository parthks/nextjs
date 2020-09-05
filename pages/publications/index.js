// import styles from '../../styles/Card.css'


export default function Publications({stories}) {
    
    return <div>
        <h1>First Post</h1>
        <div className="container">
	
	    <div className="grid-container">
            {stories?.map(publication => <PublicationCard key={publication.name} story={publication} />)}
        </div>
        </div>
        
        </div>
  }


function PublicationCard({story}) {
    const content = story["content"]
    if (!content) {return null}
    

    const authorsNames = content["author"]?.map((v => v.name)).join(", ")

    const ogImageSrc = content.pub_thumb["filename"].replace("https://a.storyblok.com", "https://img2.storyblok.com")
    const imageSrcSplit = ogImageSrc.split("https://img2.storyblok.com")
    imageSrcSplit[0] = "/150x0/filters:format(webp)"
    const imageSrc = "https://img2.storyblok.com" + imageSrcSplit.join("")

    console.log(content, imageSrc)

    return <div className="card">
        <div className="card-left">
            <img src={imageSrc} className="card-thumb"/>
            <div className="details">
            <p className="date">{content["pub_month"]} <br /> {content["pub_year"]}</p> 
                <ul className="actions">
                    <li><a target="_blank" className="share">h</a></li>
                    <li><a target="_blank" className="open">Open</a></li>
                    <li><a target="_blank" className="download">Download</a></li>
                    
                </ul>
            </div>
        </div>

        <div className="card-right">
        <div className="themes">{content["theme"]?.join(", ")}</div>
        <h2 className="title line_4">{content["pub_title"]}</h2>
        <div className="report_by">by {authorsNames}</div>
        <div className="organisation">{content["organisation"]?.name}</div>
        <div className="tags">{content["tags"]?.map((v => v.name)).join(", ")}</div>

        </div>
    </div>
}


export async function getStaticProps() {
    const StoryblokClient = require('storyblok-js-client')
    const Storyblok = new StoryblokClient({
        accessToken: 'MslfIX7625TqNydG62ia8wtt'
      })
    const publications = await Storyblok.get('cdn/stories', {
        "starts_with": "publications/",
        "per_page": 10,
        "resolve_relations": "publicationType.author,publicationType.organisation,publicationType.tags"
    })
    const stories = publications["data"]["stories"]
    // const allPostsData = getSortedPostsData()
    return {
      props: {
        stories: stories
      },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every second
        revalidate: 20, // In seconds
    }
}