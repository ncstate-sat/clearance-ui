import { minorScale, Tab } from "evergreen-ui";
import { Link, useLocation } from 'react-router-dom'

export default function SideTab({
  title,
  href = "#",
  useAnchor = true
}) {
  const location = useLocation()

  const tab = (
    <Tab
      alignItems="flex-start"
      direction="vertical"
      appearance="secondary"
      isSelected={location.pathname === href}
      marginBottom={minorScale(2)}
    >
      {title}
    </Tab>
  );

  if (useAnchor) {
    return <a href={href}>{tab}</a>;
  } else {
    return (
      <Link to={href}>
        {tab}
      </Link>
    );
  }
}
