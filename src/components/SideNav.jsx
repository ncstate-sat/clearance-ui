import {
  Heading,
  majorScale,
  minorScale,
  Pane,
  Tablist,
  useTheme,
  Tab
} from "evergreen-ui";
import { useContext } from "react";
import { useSelector } from "react-redux";
import styled, { css } from "styled-components";
import { devices } from "../utils/breakpoints";
import { LayoutContext } from "./LayoutProvider";
import SideTab from "./SideTab";

const SidebarContainer = styled(Pane)`
  background-color: ${({ backgroundColor }) => backgroundColor};
  min-height: 100vh;
  height: 100%;
  display: none;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      display: initial;

      @media ${devices.desktop} {
        padding-left: ${minorScale(4)}vw;
      }
    `}
`;

const SidebarHeading = styled(Heading)`
  padding-bottom: ${minorScale(2)}px;
`;

export default function SideNav() {
  const isLoggedIn = useSelector((state) => state.auth.token !== null);
  const { colors } = useTheme();

  const { isSidebarOpen } = useContext(LayoutContext);

  return (
    <SidebarContainer
      $isOpen={isSidebarOpen}
      backgroundColor={colors.gray50}
      paddingY={minorScale(12)}
      paddingX={minorScale(8)}
      borderRight="muted"
    >
      {isSidebarOpen && isLoggedIn && (
        <Pane
          display="flex"
          position="sticky"
          top={minorScale(24)}
          flexDirection="column"
          paddingX={minorScale(3)}
          overflowY="auto"
          width={majorScale(28)}
        >
          <Tablist width="100%">
            <SidebarHeading size={600}>Clearance Assignment</SidebarHeading>
            <SideTab
              title='Assign'
              href='/assign'
              useAnchor={false}
            />
            <SideTab
              title='Manage'
              href='/manage'
              useAnchor={false}
            />
            <SideTab
              title='Liaison Permissions'
              href='/liaison-permissions'
              useAnchor={false}
            />
            <SideTab
              title='Audit Log'
              href='/audit'
              useAnchor={false}
            />
            <SideTab
              title='Admin'
              href='/admin'
              useAnchor={false}
            />
          </Tablist>
        </Pane>
      )}
    </SidebarContainer>
  );
}
