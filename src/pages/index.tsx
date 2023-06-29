import Head from 'next/head'
import { Inter } from '@next/font/google'
import Container from '@mui/material/Container'
import MainTabs from '../components/tabs'
import ReviewTab from '../components/reviewTab'
import MemoTab, { Memo } from '../components/memoTab'
import ProgressTab from '../components/progressTab'
import SettingsTab from '../components/settingsTab'
import { queryMemos } from './api/memo'

const inter = Inter({ subsets: ['latin'] })

export default function Home({ memos } : { memos: Array<Memo>}) {
  return (
    <>
      <Head>
        <title>ReMemo</title>
        <meta name="description" content="A tool for keeping memos and reviewing them" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/rememo-icon.svg" />
      </Head>
      <main className={inter.className}>
        <Container>
          <MainTabs>
            <MemoTab memoProp={memos} label='Memos'/>
            <ReviewTab label='Review' />
            <ProgressTab label='Progress' />
            <SettingsTab label='Settings' />
          </MainTabs>
        </Container>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const memos = await queryMemos();
  
  return { props: { memos } }
}