import Link from 'next/link'
import { GetStaticProps } from 'next'
import { Layout } from '@components/Layout'

type Props = {
  articleIds: Array<string>
}

function WritingPage(props: Props) {
  return (
    <Layout>
      <h1>Writing</h1>
      <ul>
        {props.articleIds.map((id) => (
          <li key={id}>
            <Link href={`/writing/${id}`}>
              <a>{id}</a>
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: { articleIds: ['foo', 'bar'] },
  }
}

export default WritingPage
export { getStaticProps }
