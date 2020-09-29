import Link from 'next/link'

import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;

import styles from '../styles/Layout.module.css'



export default function MyLayout({children}) {
    // console.log("breadcrumbs", breadcrumbs)

    return <div>
    <NavBar />

    <Layout>

      <Layout style={{ padding: '0' }}>

        <Content
          className="site-layout-background"
          style={{
            padding: 0,
            margin: 0,
            minHeight: 'calc(100vh - 220px)',
          }}
        >
            {children}
        </Content>

        
      </Layout>
      <Footer className={styles.footer_div}>
            Footer
        </Footer>
      
    </Layout>  
    
  </div>
}


const { Title } = Typography;


function NavBar() {
    return <Layout>
        <Header className={styles.navbar_div}>
        <Link href="/"><a><Title className={`${styles.navbar_logo}`}>Connected2Work</Title></a></Link>
        <div>
            
            
        </div>
    </Header>
    </Layout>
}