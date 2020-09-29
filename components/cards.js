export function PublicationCard(props) {
        const {story} = props

        // console.log("STORY", story)
        let content = story
        if (story["content"]) {
            content = story["content"]
        }
        if (!content) {return null}
        
    
        const authorsNames = content["author"]?.map( (v, i) => <a key={i} href="#">{(v.name || v) + "" + (i !== content["author"].length-1 ? ", " : "")}</a>)
    
        const ogImageSrc = content.pub_thumb["filename"].replace("https://a.storyblok.com", "https://img2.storyblok.com")
        const imageSrcSplit = ogImageSrc.split("https://img2.storyblok.com")
        imageSrcSplit[0] = "/150x0/filters:format(webp)"
        const imageSrc = "https://img2.storyblok.com" + imageSrcSplit.join("")
    
        // console.log(content, imageSrc)
    
        // return <div className="card section_report_list">
        //     <div className="card-left">
        //         <img src={imageSrc} className="card-thumb"/>
        //         <div className="details">
        //         <p className="date">{content["pub_month"]} <br /> {content["pub_year"]}</p> 
        //             <ul className="actions">
        //                 <li><a target="_blank" className="share">h</a></li>
        //                 <li><a target="_blank" className="open">Open</a></li>
        //                 <li><a target="_blank" className="download">Download</a></li>
                        
        //             </ul>
        //         </div>
        //     </div>
    
        //     <div className="card-right">
        //     <div className="themes">{content["theme"]?.join(", ")}</div>
        //     <h2 className="title line_4">{content["pub_title"]}</h2>
        //     <div className="report_by">by {authorsNames}</div>
        //     <div className="organisation">{content["organisation"]?.name ?? content["organisation"]}</div>
        //     <div className="tags">{content["tags"]?.map((v => v.name || v)).join(", ")}</div>
    
        //     </div>
        // </div>

        const cardColor = "rgb(13, 165, 53)"

    return <div className="item" style={{"borderColor": cardColor}}>
        <div className="report_left">
            {/* <a href="http://www.oecd.org/sti/education-and-skills-in-bridging-the-digital-gender-divide-evidence-from-apec.pdf" target="_blank"> */}
            <img src={imageSrc} className="card-thumb" style={{"backgroundColor": cardColor}} />
            {/* </a> */}
            <div className="meta">
                <p className="date">{content["pub_month"]} <br />{content["pub_year"]}</p>
                <ul className="actions">
                    <li>
                        <a href="" target="_blank" title="Share" className="share">Share</a> 
                        <ul className="social_share">
                        {/* <li className="fb">
                            <a href="https://www.facebook.com/dialog/feed?app_id=472539746633665&amp;display=popup&amp;caption=Connected2Work+%7C+Publications&amp;description=Connected2Work+%7C+Publications&amp;name=Connected2Work+%7C+Publications&amp;link=https%3A%2F%2Fconnected2work.org%2Fpublications&amp;picture=https%3A%2F%2Fconnected2work.org%2Fwp-content%2Fuploads%2F2020%2F09%2FScreen-Shot-2020-09-28-at-12.32.23-PM.png&amp;redirect_uri=https%3A%2F%2Fconnected2work.org%2Fpublications" title="Share to Facebook" target="_blank">
                                <svg viewBox="0 0 49.652 49.652" className="btn_right_arrow">
                                    <use xlink:href="#facebook"></use>
                                </svg>
                            </a>
                        </li>
                        <li className="tw">
                            <a href="https://twitter.com/intent/tweet?text=https%3A%2F%2Fconnected2work.org%2Fpublications Connected2Work+%7C+Publications" title="Share to Twitter" target="_blank">
                                <svg viewBox="0 0 612 612" className="btn_right_arrow">
                                    <use xlink:href="#twitter"></use>
                                </svg>
                            </a>
                        </li> */}
                        </ul>
                    </li>
                    <li><a href="#" target="_blank" title="Host Link" className="open">Open</a></li>
                    <li><a href="#" target="_blank" title="Download report" className="download">Download</a></li>
                </ul>
            </div>
        </div >
        <div className="report_right">
            <div className="themes line_2">
                <a href={"#"}
                // href="https://connected2work.org/themes/technology-and-work/"
                style={{"color": cardColor}}>
                    {content["theme"]?.join(", ")}
                </a>
            </div>
            <h2 className="title line_4"><a href="http://www.oecd.org/sti/education-and-skills-in-bridging-the-digital-gender-divide-evidence-from-apec.pdf" target="_blank">
                {content["pub_title"]}
            </a></h2>
            <div className="report_by line_2">
                by {authorsNames}
                {/* <a href="https://connected2work.org/authors/anna-sophie-liebender/">Anna-Sophie Liebender,  </a>
                <a href="https://connected2work.org/authors/carolina-gatica/">Carolina Gatica,  </a>
                <span>et al.</span> */}
            </div>
            <div className="organisation line_2">
                {content["organisation"]?.name ?? content["organisation"]}
                {/* <a href="https://connected2work.org/organisations/asia-pacific-economic-cooperation/">Asia-Pacific Economic Cooperation, </a>
                <a href="https://connected2work.org/organisations/organization-for-economic-cooperation-and-development/">Organization For Economic Cooperation And Development</a> */}
            </div>
            <div 
            // title="Digital Era, Digital Literacy, Digital Skills, Digitalization, Education, Gender Divide, ICT, Internet, Mobile Phones, Skills, Training" 
            className="tags line_2">
                {content["tags"]?.map((v => v.name || v)).join(", ")}
                {/* <span href="https://connected2work.org/tags/digital-era/">Digital Era, </span>
                <span href="https://connected2work.org/tags/digital-literacy/">Digital Literacy, </span>
                <span href="https://connected2work.org/tags/digital-skills/">Digital Skills</span> */}
            </div>
        </div>
    </div >
}