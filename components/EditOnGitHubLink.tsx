type Props = {
  username: string
  repo: string
  file: string
  branch?: string
  children?: React.ReactNode
}

function EditOnGitHubLink(props: Props) {
  return (
    <a
      href={editOnGitHubURL(props.username, props.repo, props.file)}
      target="_blank"
      rel="noreferrer"
    >
      {props.children}
    </a>
  )
}

function editOnGitHubURL(
  username: string,
  repo: string,
  file: string,
  branch = 'main'
): string {
  return `https://github.com/${username}/${repo}/edit/${branch}/${file}`
}

export { EditOnGitHubLink }
