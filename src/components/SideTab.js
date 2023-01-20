import { minorScale, Tab } from 'evergreen-ui'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

export default function SideTab({
  title,
  href = '#',
  useAnchor = true,
  isSelected,
}) {
  const { basePath, pathname } = useRouter()
  const getLink = (path) => `${basePath}${pathname}`

  const tab = (
    <Tab
      alignItems='flex-start'
      direction='vertical'
      appearance='primary'
      isSelected={href === getLink()}
      marginBottom={minorScale(2)}
    >
      {title}
    </Tab>
  )

  if (useAnchor) {
    return <a href={href}>{tab}</a>
  } else {
    return (
      <Link href={href} passHref>
        {tab}
      </Link>
    )
  }
}

SideTab.propTypes = {
  title: PropTypes.string,
  href: PropTypes.string,
  useAnchor: PropTypes.bool,
  isSelected: PropTypes.bool,
}
