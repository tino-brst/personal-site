import { GetStaticPaths, GetStaticProps } from 'next'
import { Layout } from '@components/Layout'

type Props = {
  id: string
}

function ArticlePage(props: Props) {
  return (
    <Layout>
      <h1>{props.id}</h1>
    </Layout>
  )
}

type PathParams = {
  id: string
}

const getStaticPaths: GetStaticPaths<PathParams> = async () => {
  return {
    paths: ['foo', 'bar'].map((id) => ({ params: { id } })),
    fallback: false,
  }
}

const getStaticProps: GetStaticProps<Props, PathParams> = async (context) => {
  return {
    props: {
      id: context.params!.id,
    },
  }
}

export default ArticlePage
export { getStaticPaths, getStaticProps }
