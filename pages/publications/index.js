import Link from 'next/link'
import {Component, useState, useRef} from 'react'

// import {getFeaturedPublications} from '../../lib/publications'

import styles from '../../styles/Publications.module.css'

import Layout from '../../components/layout'


import { Typography } from 'antd';
import { Row, Col, Button, Select, Spin } from 'antd';


import {capitalize} from '../../lib/helpers'
import { CloseOutlined } from '@ant-design/icons';

import qs from 'qs'
import { InstantSearch, SearchBox, 
    Pagination, Panel,
    Highlight,
    CurrentRefinements,
    ClearRefinements,
    RefinementList,
    Configure, connectHits, connectStateResults, connectScrollTo, connectRefinementList } from 'react-instantsearch-dom';

import instantMeiliSearch from '@meilisearch/instant-meilisearch';
import {PublicationCard} from '../../components/cards'




const { Title } = Typography;
const { Option } = Select;


export default function Publications() {
    return <Layout>

        <div className="section_featured_reports" style={{padding: '50px 0px 100px'}}>
            <div className="container">
                <Title>Publications</Title>
                <Title level={2}>Featured Publications</Title>
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

    return {
        props: {
            // featuredPublications: featured,
        }
      }
}



const DEBOUNCE_TIME = 400;
const RESULTS_PER_PAGE = 3

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
        <Configure hitsPerPage={3} />

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
            <Row gutter={32}>
                <Col xs={24} sm={12} md={8}>
                    <Panel header="Theme">
                        <RefinementList operator="and" attribute="theme" 
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
                <Col xs={24} sm={12} md={6}>
                    <Panel header="Organization">
                        <CustomOrgRefinementList operator="or" attribute="organisation" />
                    </Panel>
                </Col>
                {/* <Col xs={24} sm={12} md={6}>
                    <Panel header="Sector">
                        <RefinementList operator="and" attribute="sector" transformItems={items => {
                            // console.log("REFINEMENT SEARCH", items)
                            return items.map(item => ({
                            ...item,
                            label: refineValue(item.label),
                            }))
                        }} />
                    </Panel>
                </Col> */}
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
                <CurrentRefinements transformItems={(items) => {
                    return items.map(item => ({
                        ...item,
                        label: refineValue(item.label),
                        items: item.items.map(attr => ({...attr, label: refineValue(attr.label)})),
                        // label: item.label.toUpperCase() + `🍔`,
                    }))
                }} />
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
    return <PublicationCard key={props.hit.id} story={props.hit} />;
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
    const page = searchState.page
    //searchState.configure?.hitsPerPage

    const startingCount = (page-1)*RESULTS_PER_PAGE + 1
    const endingCount = startingCount + RESULTS_PER_PAGE - 1 > nbHits ? nbHits : startingCount + RESULTS_PER_PAGE - 1

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



  const OrganizationRefinementSelect = ({items, refine, createURL, currentRefinement}) => {

    // const [currentValues, setCurrentValues] = useState(currentRefinement)
    const [openState, setOpenState] = useState(false)
    const ref = useRef(null);


    

    const [optionItems, setOptionItems] = useState({})


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
        // options[element.value] = {
        //     "value": element.value[0] ?? "",
        //     "count": element.count
        // }
    });

    // if (items.length !== Object.values(optionItems).length) {
    //     const options = {...optionItems}
    //     items.forEach(element => {
    //         options[element.value] = {
    //             "value": element.value[0] ?? "",
    //             "count": element.count
    //         }
    //     });
    //     setOptionItems(options)
    // }

    console.log("GOT ITEMS", items, optionItems, Object.values(optionItems))

    const handleChange = (newValues) => {
        console.log("VALUES SELECTED", newValues)
        refine(newValues)
        // setCurrentValues(newValue.map(arr => arr[0]))
        // const newCurrentValues = newValue.map(arr => arr[0])
        // setValue(newValue.map(arr => arr[0]))
        // refine(newValue.map(arr => arr[0]))
        // createURL([...currentRefinement, value])
    }

    const handleSelect = (newValue, option) => {
        console.log("SELECT HANDLE", newValue, option)
        // refine(newValue)
        // createURL(newValue)
        setOpenState(false)
        ref.current.blur()
    }

    const handleDeselect = (newValue, option) => {
        console.log("DESELECT HANDLE", newValue, option)
        // refine(newValue)
        // createURL(newValue)
        ref.current.blur()
        setOpenState(false)
        
    }

    

    // const currentValue = items.filter(item => item.isRefined).map(item => {
    //     console.log("ITEM VALUE", item)
    //     return [refineValue(item.value[0] ?? "")] }
    // )
    console.log("currentRefinement", currentRefinement)
    const currentValue = currentRefinement.map(v => [refineValue( typeof v === 'object' ? v[0] : v)])

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

        {Object.values(optionItems).map(item => item.count > 0 ? <Option key={item.value} label={refineValue(item.value)} >{refineValue(item.value)} ({item.count})</Option> : '')}

        {/* {items.map(item => item.count > 0 ? <Option key={item.value} label={refineValue(item.label)} >{refineValue(item.label)} ({item.count})</Option> : '')} */}
        
        
        {/* <Option key={"1"} label={"HoHo"} value={"hoho"}>{refineValue("HOHO")} ({5})</Option>
        <Option key={"2"} label={"HoHoHoo"} value={"hohooo"}>{refineValue("HOHOOO")} ({4})</Option>
        <Option key={"3"} label={"HoHoHoooo"} value={"hohooooo"}>{refineValue("HOHOOOOO")} ({3})</Option> */}
    </Select>

  }
  const CustomOrgRefinementList = connectRefinementList(OrganizationRefinementSelect);
