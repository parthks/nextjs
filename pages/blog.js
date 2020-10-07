import Layout from '../components/layout'


export default function BlogPage({HTML_content, title}) {
    
    return <Layout>
        <div class="container">
            <h1 style={{fontSize: '45px'}}>{title}</h1>
            <div dangerouslySetInnerHTML={{__html: HTML_content}}></div>
        </div>
    </Layout>
}



export async function getStaticProps() {
    // const featured = await getFeaturedPublications()
    const response = await fetch("https://wedroneu.in/wp-json/wp/v2/posts/7")
    const blogPost = await response.json()
    // console.log("blogPost", blogPost)
    return {
        props: {
            HTML_content: blogPost.content?.rendered,
            title: blogPost.title?.rendered,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every second
        revalidate: 10, // In seconds
      }
}