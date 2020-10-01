export const themesToColor = (themes) => {
    let cardColor = "rgb(204, 204, 204)"
    if (themes.length === 1 ) {
        const theme = themes[0]
        if (theme === "Platform Economy") {
            cardColor = "#a1c828"
        } else if (theme === "Artificial Intelligence") {
            cardColor = "#0090ff"
        } else if (theme === "Technology and Work: Generall") {
            cardColor = "#0da535"
        } else if (theme === "Automation") {
            cardColor = "#61dccd"
        } else if (theme === "Blockchain") {
            cardColor = "#f7751e"
        } else if (theme === "Robotics") {
            cardColor = "rgb(255, 186, 0)"
        } 
    }
    return cardColor
}


export const correctThemeName = (theme) => {
    if (theme === "Technology and Work: Generall") {
        return "Technology and Work"
    } else if (theme === "Artificial Intelligence") {
        return "AI"
    } else {
        return theme
    }
}



export function PublicationCard({ content }) {

    
        // console.log("HIT", content)

        
    
    const authorsNames = content["authors"]?.map( (v, i) => {
        return <a key={i} href="#">{v + "" + (i !== content["authors"].length-1 ? ", " : "")}</a>
    })

    const themeNames = content["themes"]?.map( (v, i) => {
        return <a key={i} href="#">{correctThemeName(v) + "" + (i !== content["themes"].length-1 ? ", " : "")}</a>
    })

    const organizationNames = content["organizations"]?.map( (v, i) => {
        return <a key={i} href="#">{v + "" + (i !== content["organizations"].length-1 ? ", " : "")}</a>
    })

    const tagNames = content["tags"]?.map( (v, i) => {
        return <a key={i} href="#">{v + "" + (i !== content["tags"].length-1 ? ", " : "")}</a>
    })


    
       const cardColor = themesToColor(content["themes"])
    

    return <div className="item" style={{"borderColor": cardColor}}>
        <div className="report_left">
            <a href={content["host_url"]} target="_blank">
                <img src={content["post_thumbnail"]} className="card-thumb" style={{"backgroundColor": cardColor}} />
            </a>
            <div className="meta">
                <p className="date">{content["pub_month"]} <br />{content["pub_year"]}</p>
                <ul className="actions">
                    <li>
                        <a href="" target="_blank" title="Share" className="share">Share</a> 
                        <ul className="social_share">
                        <li className="fb">
                            <a href={"#"/*"https://www.facebook.com/dialog/feed?app_id=472539746633665&amp;display=popup&amp;caption=Connected2Work+%7C+Publications&amp;description=Connected2Work+%7C+Publications&amp;name=Connected2Work+%7C+Publications&amp;link=https%3A%2F%2Fconnected2work.org%2Fpublications&amp;picture=https%3A%2F%2Fconnected2work.org%2Fwp-content%2Fuploads%2F2020%2F09%2FScreen-Shot-2020-09-28-at-12.32.23-PM.png&amp;redirect_uri=https%3A%2F%2Fconnected2work.org%2Fpublications*/} title="Share to Facebook" target="_blank">
                                <svg viewBox="0 0 49.652 49.652" className="btn_right_arrow">
                                <path fill="currentColor" d="M24.826,0C11.137,0,0,11.137,0,24.826c0,13.688,11.137,24.826,24.826,24.826c13.688,0,24.826-11.138,24.826-24.826    C49.652,11.137,38.516,0,24.826,0z M31,25.7h-4.039c0,6.453,0,14.396,0,14.396h-5.985c0,0,0-7.866,0-14.396h-2.845v-5.088h2.845    v-3.291c0-2.357,1.12-6.04,6.04-6.04l4.435,0.017v4.939c0,0-2.695,0-3.219,0c-0.524,0-1.269,0.262-1.269,1.386v2.99h4.56L31,25.7z    " id="facebook"></path>
                                </svg>
                            </a>
                        </li>
                        <li className="tw">
                            <a href={"#"/*"https://twitter.com/intent/tweet?text=https%3A%2F%2Fconnected2work.org%2Fpublications Connected2Work+%7C+Publications"*/} title="Share to Twitter" target="_blank">
                                <svg viewBox="0 0 612 612" className="btn_right_arrow">
                                <path fill="currentColor" d="M612,116.258c-22.525,9.981-46.694,16.75-72.088,19.772c25.929-15.527,45.777-40.155,55.184-69.411    c-24.322,14.379-51.169,24.82-79.775,30.48c-22.907-24.437-55.49-39.658-91.63-39.658c-69.334,0-125.551,56.217-125.551,125.513    c0,9.828,1.109,19.427,3.251,28.606C197.065,206.32,104.556,156.337,42.641,80.386c-10.823,18.51-16.98,40.078-16.98,63.101    c0,43.559,22.181,81.993,55.835,104.479c-20.575-0.688-39.926-6.348-56.867-15.756v1.568c0,60.806,43.291,111.554,100.693,123.104    c-10.517,2.83-21.607,4.398-33.08,4.398c-8.107,0-15.947-0.803-23.634-2.333c15.985,49.907,62.336,86.199,117.253,87.194    c-42.947,33.654-97.099,53.655-155.916,53.655c-10.134,0-20.116-0.612-29.944-1.721c55.567,35.681,121.536,56.485,192.438,56.485    c230.948,0,357.188-191.291,357.188-357.188l-0.421-16.253C573.872,163.526,595.211,141.422,612,116.258z" id="twitter"></path>
                                </svg>
                            </a>
                        </li>
                        </ul>
                    </li>
                    <li><a href={content["host_url"]} target="_blank" title="Host Link" className="open">Open</a></li>
                    <li><a href={content["host_url"]} target="_blank" title="Download report" className="download">Download</a></li>
                </ul>
            </div>
        </div >
        <div className="report_right">
            <div className="themes line_2">
                <a href={"#"}
                // href="https://connected2work.org/themes/technology-and-work/"
                style={{"color": cardColor}}>
                    {themeNames}
                </a>
            </div>
            <h2 className="title line_4"><a href={content["host_url"]} target="_blank">
                {content["title"]}
            </a></h2>
            <div className="report_by line_2">
                by {authorsNames}
                {/* <a href="https://connected2work.org/authors/anna-sophie-liebender/">Anna-Sophie Liebender,  </a>
                <a href="https://connected2work.org/authors/carolina-gatica/">Carolina Gatica,  </a>
                <span>et al.</span> */}
            </div>
            <div className="organisation line_2">
                {organizationNames}
                {/* <a href="https://connected2work.org/organisations/asia-pacific-economic-cooperation/">Asia-Pacific Economic Cooperation, </a>
                <a href="https://connected2work.org/organisations/organization-for-economic-cooperation-and-development/">Organization For Economic Cooperation And Development</a> */}
            </div>
            <div 
            // title="Digital Era, Digital Literacy, Digital Skills, Digitalization, Education, Gender Divide, ICT, Internet, Mobile Phones, Skills, Training" 
            className="tags line_2">
                {tagNames}
                {/* <span href="https://connected2work.org/tags/digital-era/">Digital Era, </span>
                <span href="https://connected2work.org/tags/digital-literacy/">Digital Literacy, </span>
                <span href="https://connected2work.org/tags/digital-skills/">Digital Skills</span> */}
            </div>
        </div>
    </div >
}