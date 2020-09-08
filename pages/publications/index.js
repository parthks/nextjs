// import styles from '../../styles/Card.css'
import {useState} from 'react'
import { Input } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import useSWR from 'swr'

import { Checkbox } from 'antd';


const { Search } = Input;

const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );


function fetcher(path, query, themes, sectors) {
    console.log("query", query)
    const url = "https://search.wedroneu.in"+path
    console.log("FETCHING", url, query)
    let facetFilters = []
    if (themes.length) {
        facetFilters = [...themes.map(theme => [`theme:${theme}`]) ]
    }
    if (sectors.length) {
        console.log("sectors", sectors)
        facetFilters = facetFilters.concat(sectors.map(sector => [`sector:${sector}`]))
        console.log("facetFilters", facetFilters)
    }


    const queryBody = {
        "facetsDistribution": ["theme", "sector"],
    }

    if (facetFilters.length) {
        console.log("facetFilters GOOO", facetFilters)
        queryBody["facetFilters"] = facetFilters
    }

    if (query !== "") {queryBody["q"] = query}

    

    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Meili-Api-Key': 'c41a7ff3dce6736c955d01af935c24b39bc6c5897b9cf5c9db97edd75a0f733f'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(queryBody)

    })
    .then(res => res.json())
    .catch(err => console.log(err))
    
}


function usePublications(queryObj) {
    const { data, error } = useSWR(['/indexes/publications/search', queryObj["q"], queryObj["themes"], queryObj["sectors"]], fetcher)

    return {
        publications: data,
        isLoading: !error && !data,
        isError: error
      }
}


export default function Publications({stories}) {
    const [query, setQuery] = useState('')

    const [themesSelected, setSelectedThemes] = useState([])
    const [sectorsSelected, setSelectedSectors] = useState([])

    const { publications, isLoading, isError } = usePublications({
        "q": query,
        "themes": themesSelected,
        "sectors": sectorsSelected
    })

    let main = null
    // if (query === '') {
    //     console.log("OG STORIES", stories)
    //     main = <div className="grid-container">
    //         {stories?.map(publication => <PublicationCard key={publication.name} story={publication} />)}
    //     </div>
    // } else 
    if (isLoading) {
        main = <div>Loading</div>
    } else if (isError) {
        main = <div>Error</div>
    } else {
        console.log("PUBLICATIONS", publications)
        main = <div className="grid-container">
            {publications["hits"]?.map(publication => <PublicationCard key={publication.id} story={publication} />)}
        </div>
    }

    let facets = null
    if (publications && publications["facetsDistribution"]) {
        console.log("facetsDistribution", publications["facetsDistribution"])
        facets = true
    }
    
    return <div style={{margin: '20px'}}>
        <h1>Publications</h1>
        <Search size="large" enterButton
        placeholder="input search text" 
        onChange={e => {console.log(e.target.value); setQuery(e.target.value)}}
        onSearch={value => console.log(value)}  /> <br />

        {facets ? <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-around'}}>
            <ThemeSelection 
                setSelectedThemes={setSelectedThemes}
                themesSelected={themesSelected} 
                themes={publications["facetsDistribution"]["theme"]}/>
            <SectorSelection 
                setSelectedSectors={setSelectedSectors}
                sectorsSelected={sectorsSelected} 
                sectors={publications["facetsDistribution"]["sector"]}/>
        </div>
             : ''}

        <div className="container">
            {main}
        </div>
        
        </div>
  }




function ThemeSelection(props) {

    const THEMES = {
        "ai": "Artificial  Intelligence",
        "technology and work": "Technology and Work",
        "platform economy": "Platform Economy",
        "automation": "Automation"
    }

    const themeFacets = props["themes"]
    
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        props.setSelectedThemes(checkedValues)
    }

    const options = Object.keys(THEMES).filter((themeKey) => themeFacets[themeKey] !== 0).map((theme) => {
        // console.log(themeFacets, theme)
        return {
            "label": `${THEMES[theme]} (${themeFacets[theme]})`,
            "value": theme
        }
    })

    return <div>
        <h3>Themes</h3>
        <Checkbox.Group defaultValue={props.themesSelected} className={"column-checkboxes"} options={options} onChange={onChange} />
    </div>
}  


function SectorSelection(props) {

    const SECTORS = {
        "agriculture": "Agriculture",
        "industry": "Industry",
        "services": "Services"
    }

    const sectorFacets = props["sectors"]
    
    function onChange(checkedValues) {
        console.log('checked = ', checkedValues);
        props.setSelectedSectors(checkedValues)
    }

    const options = Object.keys(SECTORS).filter((sectorKey) => sectorFacets[sectorKey] !== 0).map((sector) => {
        // console.log(sectorFacets, sector)
        return {
            "label": `${SECTORS[sector]} (${sectorFacets[sector]})`,
            "value": sector
        }
    })

    return <div>
        <h3>Sectors</h3>
        <Checkbox.Group defaultValue={props.sectorsSelected} className={"column-checkboxes"} options={options} onChange={onChange} />
    </div>
}  




function PublicationCard({story}) {
    // console.log("STORY", story)
    let content = story
    if (story["content"]) {
        content = story["content"]
    }
    if (!content) {return null}
    

    const authorsNames = content["author"]?.map((v => v.name || v)).join(", ")

    const ogImageSrc = content.pub_thumb["filename"].replace("https://a.storyblok.com", "https://img2.storyblok.com")
    const imageSrcSplit = ogImageSrc.split("https://img2.storyblok.com")
    imageSrcSplit[0] = "/150x0/filters:format(webp)"
    const imageSrc = "https://img2.storyblok.com" + imageSrcSplit.join("")

    // console.log(content, imageSrc)

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
        <div className="organisation">{content["organisation"]?.name ?? content["organisation"]}</div>
        <div className="tags">{content["tags"]?.map((v => v.name || v)).join(", ")}</div>

        </div>
    </div>
}


export async function getStaticProps() {
    // const StoryblokClient = require('storyblok-js-client')
    // const Storyblok = new StoryblokClient({
    //     accessToken: 'MslfIX7625TqNydG62ia8wtt'
    //   })
    // const publications = await Storyblok.get('cdn/stories', {
    //     "starts_with": "publications/",
    //     "per_page": 10,
    //     "resolve_relations": "publicationType.author,publicationType.organisation,publicationType.tags"
    // })
    // const stories = publications["data"]["stories"]
    // const allPostsData = getSortedPostsData()
    return {
      props: {
        //stories: stories
      },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every second
        revalidate: 20, // In seconds
    }
}