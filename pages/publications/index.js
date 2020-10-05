import Link from 'next/link'
import Head from 'next/head'

import {Component, useState, useRef, useEffect} from 'react'

import {getFeaturedPublications} from '../../lib/publications'
import {themesToColor, correctThemeName} from '../../components/cards'

import styles from '../../styles/Publications.module.css'

import Layout from '../../components/layout'


import { Typography } from 'antd';
import { Row, Col, Button, Select, Spin, Slider, Carousel } from 'antd';


import {capitalize} from '../../lib/helpers'
import { CloseOutlined } from '@ant-design/icons';

import qs from 'qs'
import { InstantSearch, SearchBox, 
    Pagination, Panel,
    Highlight,
    CurrentRefinements,
    ClearRefinements,
    RefinementList,
    Configure, connectHits, connectStateResults, connectScrollTo, connectRefinementList, connectCurrentRefinements } from 'react-instantsearch-dom';

import instantMeiliSearch from '@meilisearch/instant-meilisearch';
import {PublicationCard} from '../../components/cards'



// import { Carousel } from 'react-responsive-carousel';


const { Title } = Typography;
const { Option } = Select;


function SlideshowCard({data}) {
    // let cardColor = "rgb(204, 204, 204)"
    const cardColor = themesToColor(data["themes"])
    const authorsNames = data["authors"]?.map( (v, i) => {
        return <a key={i} href="#">{v + "" + (i !== data["authors"].length-1 ? ", " : "")}</a>
    })

    const themeNames = data["themes"]?.map( (v, i) => {
        return <a key={i} href="#">{correctThemeName(v) + "" + (i !== data["themes"].length-1 ? ", " : "")}</a>
    })

    const organizationNames = data["organizations"]?.map( (v, i) => {
        return <a key={i} href="#">{v + "" + (i !== data["organizations"].length-1 ? ", " : "")}</a>
    })

    const tagNames = data["tags"]?.map( (v, i) => {
        return <a key={i} href="#">{v + "" + (i !== data["tags"].length-1 ? ", " : "")}</a>
    })


    return <Row gutter={32} className="cycle-slide cycle-sentinel" style={{position: "static", top: "0px", left: "0px", zIndex: 100, opacity: 1, textAlign: 'left'}}>
        <Col xs={24} sm={24} md={10}>
            <figure>
                <img src={data.post_thumbnail} style={{"background": cardColor, width: '100%'}} alt="" />
            </figure>
        </Col>
        <Col xs={24} sm={24} md={14}>
            <h4 style={{color: cardColor}}>{themeNames}</h4>
            <h3>{data.title}</h3>
            <p className="report_by">by {authorsNames}</p>
            <p className="report_date">{data.pub_month} {data.pub_year}</p>
            <p className="report_description">{data.description}</p>
            <p className="report_tags">{tagNames}</p>
            <a href={data.host_url} target="_blank" className="btn">download </a>
            <a href={data.organization_url} target="_blank" className="open">Open</a>
        </Col>
    </Row>
}

function SlideshowThumb({active, changeSlide, data}) {
    // let cardColor = "rgb(204, 204, 204)"

    const cardColor = themesToColor(data["themes"])

    const themeNames = data["themes"]?.map( (v, i) => {
        return <a key={i} href="#">{correctThemeName(v) + "" + (i !== data["themes"].length-1 ? ", " : "")}</a>
    })

    return <li onClick={changeSlide} style={{"color": cardColor}} className={active ? "cycle-pager-active" : ''}>
    {themeNames}
        <h2>{data.title}</h2>
    </li>
}

function PublicationSlideshow({data}) {
    const [index, setIndex] = useState(0)
    const ref = useRef(null)

    const slideChanged = (from, toIndex) => {
        // console.log(toIndex)
        setIndex(toIndex)
    }

    const changeSlideToIndex = (index) => {
        // console.log("CHANGE", index)
        ref.current.goTo(index)
    }

    const slideshowCards = data.map(publication => <SlideshowCard key={publication.id} data={publication} />)
    const slideshowThumbs = data.map((publication, i) => <SlideshowThumb key={publication.id} 
        changeSlide={() => changeSlideToIndex(i)} active={index === i}
        data={publication} />)

    return <div>
        <Row gutter={[8,32]}>
        <Col className="cycle-slideshow" xs={{span: 22, offset: 1}} sm={{span: 22, offset: 1}} md={{span: 12, offset: 2}} lg={{span: 14, offset: 0}}>
        <a onClick={(e) => {
            e.preventDefault()
            ref.current.prev()
        }} href="#" className="cycle-controls cycle-prev slick-arrow">Prev</a>
        
            <Carousel autoplay={true} ref={ref} dots={false} effect="fade" beforeChange={slideChanged}>
                    

            {slideshowCards}
                        
                        
            </Carousel>
        <a onClick={(e) => {
            e.preventDefault()
            ref.current.next()
        }} href="#" className="cycle-controls cycle-next slick-arrow">Next</a>
        </Col>
        <Col className={"cycle_slider_pager"} xs={24} sm={24} md={{span: 8, offset: 2}}>
            {slideshowThumbs}
        </Col>
        </Row>
    </div>
}


export default function Publications({featuredPublications}) {
    
    return <Layout>
        <Head>
            {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-N5TJT8HFTZ"></script>
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-N5TJT8HFTZ');` }} />
        </Head>

        <div className="section_featured_reports" style={{padding: '50px 0px 100px'}}>
            <div className="container">
                <Title>Publications</Title>
                <Title level={2}>Featured Publications</Title>
                <PublicationSlideshow data={featuredPublications} />
                
            </div>
        </div>
        

        
        <SearchAndFilteringStuff />
        



        <section className={styles.section_explore}>
		
		<div className={"container"}>
			<div className={styles.row}>
					<h2>How you can contribute</h2>
			</div>
            <Row>
                <Col className={styles.section_explore_div} xs={24} sm={8}>
                    <div className={styles.thumbnail}>
                        <a href="https://connected2work.org/submit-a-resource">
                            <img src="https://connected2work.org/wp-content/themes/research/images/icon_submit.svg" alt="Icon 1" />
                            <div className={styles.caption}>
                                <h3>Submit a Resource</h3>
                            </div>
                        </a>
                    </div>
                </Col>
                <Col className={styles.section_explore_div} xs={24} sm={8}>
                    <div className={styles.thumbnail}>
                        <a href="https://connected2work.org/request-an-edit">
                            <img src="https://connected2work.org/wp-content/themes/research/images/icon_request.svg" alt="Icon 1" />
                            <div className={styles.caption}>
                                <h3>Request an Edit</h3>
                            </div>
                        </a>
                    </div>
                    </Col>
                <Col className={styles.section_explore_div} xs={24} sm={8}>
                    <div className={styles.thumbnail}>
                        <a href="https://connected2work.org/report-an-issue">
                            <img src="https://connected2work.org/wp-content/themes/research/images/icon_report.svg" alt="Icon 1" />
                            <div className={styles.caption}>
                                <h3>Report an Issue</h3>
                            </div>
                        </a>
                    </div>
                </Col>		
            </Row>
        </div>
	</section>


    </Layout>
}




export async function getStaticProps() {
    // const featured = await getFeaturedPublications()
    const featured = await getFeaturedPublications()
    // console.log("FEATURED", featured)
    return {
        props: {
            featuredPublications: featured,
        }
      }
}

























const DEBOUNCE_TIME = 400;
const RESULTS_PER_PAGE = 9

const searchClient = instantMeiliSearch(
    "https://search.wedroneu.in",
    "c41a7ff3dce6736c955d01af935c24b39bc6c5897b9cf5c9db97edd75a0f733f"
    );

const createURL = state => `?${qs.stringify(state)}`;

const searchStateToUrl = ({ location }, searchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : '';

const urlToSearchState = (search) => {
    // console.log("urlToSearchState", search)
    if (search && search.slice) {
        return qs.parse(search.slice(1))
    } else {
        return {}
    }
}


const REFINEMENT_LABEL_KEY_VALUES = {
    "ai": "AI"
}

const refineValue = (crude) => REFINEMENT_LABEL_KEY_VALUES[crude] ?? capitalize(crude)

function SearchAndFilteringStuff() {
    const [searchState, setSearchState] = useState(urlToSearchState(typeof window !== 'undefined' ? window.location.search : false));
    const [debouncedSetState, setDebouncedSetState] = useState(null);

    const onSearchStateChange = updatedSearchState => {
    clearTimeout(debouncedSetState);
    if (typeof window !== 'undefined') {
        
        if (updatedSearchState.query) {
            // console.log("SEARCH STATEEE", updatedSearchState)
            gtag('event', 'search', {
                search_term: updatedSearchState.query
            });
        }
        setDebouncedSetState(
            setTimeout(() => {
            // console.log("PUSHING STATEEE", updatedSearchState, searchStateToUrl(updatedSearchState))
            history.pushState(
                updatedSearchState,
                null,
                createURL(updatedSearchState)
            );
            }, DEBOUNCE_TIME)
        );
        setSearchState(updatedSearchState);
    }

    
    };

    return <InstantSearch
        indexName="publications"
        searchClient={searchClient}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
    >   
        <Configure hitsPerPage={RESULTS_PER_PAGE} />

        <div className="section_search">
        <div className="container">
        <Row>
            <Col xs={24} sm={24} md={16} lg={18}>
                <Title level={2}>Search for reports, authors and subjects discussed</Title>
            </Col>
            <Col xs={24} sm={24} md={8} lg={6}>
                <Row>
                <Col id="makeLayoutGridDiv" xs={0} sm={0} md={6} className="inactive">
                    <div style={{cursor: 'pointer'}} onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("dataLayoutSection").setAttribute("data-layout", "layout_grid")
                        document.getElementById("makeLayoutGridDiv").classList.add("inactive")
                        document.getElementById("makeLayoutListDiv").classList.remove("inactive")
                    }} className="layout layout_grid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.7 16.07" className="svg_icon"><g id="Layer_2" data-name="Layer 2"><g id="Layer_4" data-name="Layer 4"><rect width="13.15" height="7.03" className="grid"></rect><rect x="15.55" width="13.15" height="7.03" className="grid"></rect><rect y="9.04" width="13.15" height="7.03" className="grid"></rect><rect x="15.55" y="9.04" width="13.15" height="7.03" className="grid"></rect></g></g></svg> <span>Grid</span></div>
                </Col>
                <Col id="makeLayoutListDiv" xs={0} sm={0} md={6}>
                    <div style={{cursor: 'pointer'}} onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("dataLayoutSection").setAttribute("data-layout", "layout_list")
                        document.getElementById("makeLayoutGridDiv").classList.remove("inactive")
                        document.getElementById("makeLayoutListDiv").classList.add("inactive")
                    }} className="layout layout_list"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.1 16.07" className="svg_icon"><g id="Layer_2" data-name="Layer 2"><g id="Layer_4" data-name="Layer 4"><rect width="19.1" height="3.52" className="list"></rect><rect y="6.27" width="19.1" height="3.52" className="list"></rect><rect y="12.55" width="19.1" height="3.52" className="list"></rect></g></g></svg> <span>List</span></div>
                </Col>

                <Col id="advancedFiltersSectionButton" xs={24} sm={24} md={10}>
                    <a onClick={(e) => {
                        e.preventDefault()
                        document.getElementById("advancedFiltersSection").classList.remove("hide")
                        document.getElementById("advancedFiltersSectionButton").classList.add("hide")
                        // if (document.getElementById("advancedFiltersSection").classList.contains("hide")) {
                        //     document.getElementById("advancedFiltersSection").classList.remove("hide")
                        // } else {
                        //     document.getElementById("advancedFiltersSection").classList.add("hide")
                        // }
                    }} href="" className="filter_search"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.36 18.36" className="svg_icon"><g id="Layer_2" data-name="Layer 2"><g id="Layer_4" data-name="Layer 4"><path d="M17.7,8.52H7.12a2.61,2.61,0,0,0-5.06,0H.66a.66.66,0,1,0,0,1.31h1.4a2.61,2.61,0,0,0,5.06,0H17.7a.66.66,0,1,0,0-1.31Zm-13.11,2A1.31,1.31,0,1,1,5.9,9.18,1.31,1.31,0,0,1,4.59,10.49Z" className="filter"></path><path d="M17.7,2H15.64a2.61,2.61,0,0,0-5.06,0H.66a.66.66,0,0,0,0,1.31h9.93a2.61,2.61,0,0,0,5.06,0H17.7A.66.66,0,0,0,17.7,2Zm-4.59,2a1.31,1.31,0,1,1,1.31-1.31A1.31,1.31,0,0,1,13.11,3.93Z" className="filter"></path><path d="M17.7,15.08H14.33a2.61,2.61,0,0,0-5.06,0H.66a.66.66,0,1,0,0,1.31H9.27a2.61,2.61,0,0,0,5.06,0H17.7a.66.66,0,1,0,0-1.31Zm-5.9,2a1.31,1.31,0,1,1,1.31-1.31A1.31,1.31,0,0,1,11.8,17Z" className="filter"></path></g></g></svg> <span>FILTER</span></a>
                </Col>
                </Row>
            </Col>
        </Row>






        <Row id="advancedFiltersSection" className="advanced_filters hide">
        <Col span={24}>
            <Row align="middle">
            <Col span={18}>
                <Title level={3}>Filter publications by</Title>
            </Col>
            <Col style={{textAlign: 'right'}} span={6}>
                <Button onClick={() => {
                    document.getElementById("advancedFiltersSection").classList.add("hide")
                    document.getElementById("advancedFiltersSectionButton").classList.remove("hide")
                }} type="default" shape="circle" icon={<CloseOutlined />} />
            </Col>
            </Row>
        </Col>
            
            
            
            
            
            
        
        <Col span={24}>
            <Row gutter={[32, 16]}>
                <Col xs={24} sm={12} md={8}>
                    <Panel header="Theme">
                        <RefinementList operator="and" attribute="themes" 
                        transformItems={items => {
                            // console.log("REFINEMENT SEARCH", items)
                            return items.map(item => {
                                // if (item.count === 0) {return {}}
                                return {
                                    ...item,
                                    label: refineValue(item.label),
                                }
                            })
                        }}
                        />
                    </Panel>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Panel header="Sector">
                        <RefinementList operator="and" attribute="sector" transformItems={items => {
                            // console.log("REFINEMENT SEARCH", items)
                            return items.map(item => ({
                            ...item,
                            label: refineValue(item.label),
                            }))
                        }} />
                    </Panel>
                </Col>
                
                <Col xs={24} sm={12} md={5}>
                    <Panel header="Region">
                        <CustomRefinementList limit={100} operator="and" attribute="geo_region" />
                    </Panel>
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Panel header="Organization">
                        <CustomRefinementList limit={200} operator="and" attribute="organizations" />
                    </Panel> <br />
                    <Panel header="Date">
                        <CustomRefinementSlider min={2003} max={2022} attribute={"pub_year"} />
                    </Panel>
                </Col>
               
            </Row>
        </Col>

        </Row>
        
        <br />

        <SearchBox />

        <br />

        <Row gutter={[0, 8]}>
            <Col flex="100px">
                <ClearRefinements translations={{
                    reset: 'Reset filters',
                }} />
            </Col>
            <Col flex="auto">
                <CustomCurrentRefinements />
                {/* <CurrentRefinements transformItems={(items) => {
                    console.log("CurrentRefinements ITEMS", items)
                    return items.map(item => ({
                        ...item,
                        currentRefinement: item.attribute === "pub_year" ? [item.currentRefinement[0], item.currentRefinement[item.currentRefinement.length - 1] ] : item.currentRefinement,
                        label: item.attribute === "pub_year" ? "Date" : refineValue(item.label),
                        items: item.items?.map(attr => ({...attr, label: refineValue(attr.label)})),
                        // label: item.label.toUpperCase() + `🍔`,
                    }))
                }} /> */}
            </Col>
        </Row>

        <br />
        
        
       

        </div>
        </div>



        <div className="section_report_lists container">
        
        <CustomScrollTo><CustomStateStatsResults /></CustomScrollTo>
        
        <CustomHits />
        <br />

        <Pagination  />
        </div>


    </InstantSearch>
}

function Hit(props) {
    // console.log("HIT", props)
    return <PublicationCard key={props.hit.id} content={props.hit} />;
}

const Hits = ({ hits }) => {
    // console.log("HITS", hits)
    return <section id="dataLayoutSection" data-layout="layout_grid">
        <ul className="section_report_list">
            {hits.map(hit => (
            <li key={hit.id}>{<Hit hit={hit} />}</li>
            ))}
        </ul>
    </section>
};
  
const CustomHits = connectHits(Hits);


// const Stats = ({ nbHits }) => <p style={{margin: '30px 0px'}}>Showing {nbHits} report{nbHits === 1 ? "" : 's'}</p>;
// const CustomStats = connectStats(Stats);
const StateStatsResults = ({searchState, searchResults, isSearchStalled}) => {
    // console.log("searchState", searchState)
    const hasResults = searchResults && searchResults.nbHits !== 0;
    const nbHits = searchResults && searchResults.nbHits;
    const page = searchState.page ?? 1
    //searchState.configure?.hitsPerPage

    const startingCount = (page-1)*RESULTS_PER_PAGE + 1
    const endingCount = startingCount + RESULTS_PER_PAGE - 1 > nbHits ? nbHits : startingCount + RESULTS_PER_PAGE - 1

    // console.log("STATS", page, nbHits, startingCount, endingCount)

    return <div style={{padding: '30px 0px'}}>
            
            {isSearchStalled ? <Spin /> : <div>
                <div hidden={!hasResults}>Showing {startingCount}-{endingCount} of {nbHits} report{nbHits === 1 ? "" : 's'}</div>
                <div hidden={hasResults}>No reports found</div>
            </div>}
        </div>
  };
  
const CustomStateStatsResults = connectStateResults(StateStatsResults);


class ScrollTo extends Component {
    componentDidUpdate(prevProps) {
      const { value, hasNotChanged } = this.props;
  
      if (value !== prevProps.value && hasNotChanged) {
        this.el.scrollIntoView({behavior: "smooth", block: 'start'});
      }
    }
  
    render() {
      return (
        <div ref={ref => (this.el = ref)}>
          {this.props.children}
        </div>
      );
    }
  }
  
  const CustomScrollTo = connectScrollTo(ScrollTo);



const RefinementListSelectDropdown = ({items, refine, createURL, currentRefinement}) => {

    // const [currentValues, setCurrentValues] = useState(currentRefinement)
    const [openState, setOpenState] = useState(false)
    const ref = useRef(null);


    const [optionItems, setOptionItems] = useState({})

    
    const itemLabels = items.map(item => item.label)
    const itemCounts = items.map(item => item.count)

    useEffect(() => {
        
        Object.values(optionItems).forEach(element => {
            if (itemLabels.indexOf(element.value) === -1 && element.count !== 0) {
                setOptionItems({
                    ...optionItems,
                    [element.value]: {
                        "value": element.value,
                        "count": 0},
                })
            } 
        });
    
        items.forEach(element => {
            if (optionItems[element.label]) {
                if (optionItems[element.label].count !== element.count) {
                    setOptionItems({
                        ...optionItems,
                        [element.label]: {
                            "value": element.label,
                            "count": element.count},
                    })
                }
            } else {
                setOptionItems({
                    ...optionItems,
                    [element.label]: {
                        "value": element.label,
                        "count": element.count},
                })
            }
      
        });
    }, [itemLabels, itemCounts])

    

    

    // console.log("GOT ITEMS", items, optionItems, Object.values(optionItems))

    const handleChange = (newValues) => {
        // console.log("VALUES SELECTED", newValues)
        refine(newValues)
        // setCurrentValues(newValue.map(arr => arr[0]))
        // const newCurrentValues = newValue.map(arr => arr[0])
        // setValue(newValue.map(arr => arr[0]))
        // refine(newValue.map(arr => arr[0]))
        // createURL([...currentRefinement, value])
    }

    const handleSelect = (newValue, option) => {
        // console.log("SELECT HANDLE", newValue, option)
        // refine(newValue)
        // createURL(newValue)
        setOpenState(false)
        ref.current.blur()
    }

    const handleDeselect = (newValue, option) => {
        // console.log("DESELECT HANDLE", newValue, option)
        // refine(newValue)
        // createURL(newValue)
        ref.current.blur()
        setOpenState(false)
        
    }

    

    // const currentValue = items.filter(item => item.isRefined).map(item => {
    //     console.log("ITEM VALUE", item)
    //     return [refineValue(item.value[0] ?? "")] }
    // )
    // console.log("currentRefinement", currentRefinement)
    const currentValue = currentRefinement.map(v => typeof v === 'object' ? v[0] : v)

    // console.log("ITEMS", items);
    
    // console.log("CURRENT VALUE", currentValue)

    return <Select
        ref={ref}
        dropdownMatchSelectWidth={false}
        mode="multiple"
        open={openState}
        onFocus={() => setOpenState(true)}
        onBlur={() => setOpenState(false)}
    //   defaultValue={items.filter(item => item.isRefined).map(item => item.value)}
        value={currentValue}
        showArrow
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        onChange={handleChange}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        optionLabelProp="label"
    >

        {Object.values(optionItems).map(item => item.count > 0 ? <Option key={item.value} value={item.value} label={refineValue(item.value)} >{refineValue(item.value)} ({item.count})</Option> : '')}

        {/* {items.map(item => item.count > 0 ? <Option key={item.value} label={refineValue(item.label)} >{refineValue(item.label)} ({item.count})</Option> : '')} */}
        
        
        {/* <Option key={"1"} label={"HoHo"} value={"hoho"}>{refineValue("HOHO")} ({5})</Option>
        <Option key={"2"} label={"HoHoHoo"} value={"hohooo"}>{refineValue("HOHOOO")} ({4})</Option>
        <Option key={"3"} label={"HoHoHoooo"} value={"hohooooo"}>{refineValue("HOHOOOOO")} ({3})</Option> */}
    </Select>

  }
const CustomRefinementList = connectRefinementList(RefinementListSelectDropdown);






// const RangeSlider = ({min, max, refine, currentRefinement, testing}) => {
//     console.log("SLIDER", min, max, currentRefinement, testing)

//     const handleChange = (valuesArray) => {
//         refine({min: valuesArray[0], max: valuesArray[1]})
//     }
//     const marks = {
//         2003: 2003,
//         2022: 2022
//     }
//     return <Slider min={min} max={max} range marks={marks} value={[currentRefinement["min"] ?? min, currentRefinement["max"] ?? max]} onChange={handleChange} />
// };

// const CustomRangeSlider = connectRange(RangeSlider);






const RefinementListSlider = ({items, refine, currentRefinement, min, max}) => {
    

    const handleChange = (newValues) => {
        // console.log("VALUES SELECTED", newValues)
        const start = newValues[0] ?? min
        const end = newValues[1] ?? max

        const values = []
        for(let i = start; i <= end; i++) {
            values.push(i)
        }
        refine(values)

    }


    // const currentValue = currentRefinement.map(v => typeof v === 'object' ? v[0] : v)
    // console.log("SLIDER VALUE", currentRefinement)
  
    const marks = {
        2003: 2003,
        2022: 2022
    }

    items.forEach(item => {
        // console.log("SLIDER", item)
        if (item.count > 0) {marks[parseInt(item.label)] = ""}
    })

    return <Slider min={min} max={max}
    range marks={marks}
    defaultValue={[min, max]}
    value={[currentRefinement[0] ?? min, currentRefinement[currentRefinement.length - 1] ?? max]} 
    onChange={handleChange} />


  }
  const CustomRefinementSlider = connectRefinementList(RefinementListSlider);





















  const CurrentRefinementsCustomComponent = ({ items, refine }) => {
      const [removePubYears, setRemovePubYears] = useState(false)

      
      const refineResetPubYear = (item) => {
          let currentRefinementFunctions = []
          if (item.clearValues) {
              currentRefinementFunctions = item.clearValues
          } else {
            currentRefinementFunctions = item.items.map(item => item.value)
          }
            // console.log("RESET", currentRefinementFunctions)
            //refine(currentRefinementFunctions)
            currentRefinementFunctions.forEach(year => refine(year))
      }

      if (removePubYears) {
        let found = false;
        for(let i = 0; i < items.length; i++) {
          if (items[i].attribute === "pub_year") {
              found = true
            //   console.log("ITEM PUB YEAR", items[i])
              refineResetPubYear(items[i])
          }
        }
        if (!found) {
          setRemovePubYears(false)
        }
    }


    return <ul className="ais-CurrentRefinements-list">
      {items.map(item => {
          
          let label = null
        //   console.log("REFINEMENT ITEM", item)
          if (item.attribute === "pub_year") {label = "Date: "}
          else if (item.attribute === "geo_region") {label = "Region: "}
          else {label = refineValue(item.label);}


          if (item.attribute === "pub_year" ) {
            // item.value = `${item.currentRefinement[0]} - ${item.currentRefinement[item.currentRefinement.length - 1]}`
            if (!item.clearValues) {
                const clearValueFunctions = item.items.map(item => item.value)
                item.clearValues = clearValueFunctions
            }
            
            item.items = [{
                label: `${item.currentRefinement[0]} - ${item.currentRefinement[item.currentRefinement.length - 1]}`, 
                value: "pub_year_special", 
            }]
            
          }

            
        return <li className="ais-CurrentRefinements-item" key={label}>
          {item.items ? (
            <React.Fragment>
              
                <span className="ais-CurrentRefinements-label">
                    {label}
                </span>
                
                {item.items.map(nested => {
                    // console.log("NESTED ITEMS", nested)
                    return <span key={nested.label} className="ais-CurrentRefinements-category">
                        <span className="ais-CurrentRefinements-categoryLabel">
                            {refineValue(nested.label)}
                        </span>
                        <button onClick={() => nested.value === "pub_year_special" ? setRemovePubYears(true) : refine(nested.value)} className="ais-CurrentRefinements-delete">✕</button>
                    </span>

              
                } )}
            </React.Fragment>
          ) : (
            <span key={label} className="ais-CurrentRefinements-category">
                <span className="ais-CurrentRefinements-categoryLabel">
                    {label}
                </span>
                <button onClick={() => refine(item.value)} className="ais-CurrentRefinements-delete">✕</button>
            </span>
            
          )}
        </li>
      })}
          
    </ul>
  };

const CustomCurrentRefinements = connectCurrentRefinements(CurrentRefinementsCustomComponent);
