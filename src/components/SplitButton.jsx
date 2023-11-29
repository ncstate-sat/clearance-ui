import { useState, useEffect } from 'react'
import { Pane, Button, CaretDownIcon } from 'evergreen-ui'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  z-index: 10;
`

const Container = styled.div`
  width: ${({ width }) => width};
`

const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 30px;
  grid-template-rows: auto;
  z-index: ${({ $activeDropdown }) => ($activeDropdown ? '20' : '1')};
`

const OptionsContainer = styled(Pane)`
  position: absolute;
  background-color: white;
  display: grid;
  grid-template-rows: auto auto;
  width: 100%;
  margin-top: 4px;
  z-index: 20;
  max-height: 12.5rem;
  overflow-y: scroll;
  width: inherit;
`

const Option = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-family: 'SF UI Text', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 12px;
  font-weight: 400;
  color: rgb(71, 77, 102);
  z-index: inherit;
  background-color: ${({ $highlighted }) =>
    $highlighted ? 'rgb(237, 239, 245)' : 'inherit'};

  &:not(:first-of-type) {
    border-top: 1px solid rgb(237, 239, 245);
  }

  &:hover {
    background-color: rgb(237, 239, 245);
  }
`

export default function SplitButton({
  onClick,
  onChangeMode,
  options,
  width,
  theme,
  marginTop,
  marginBottom,
  isLoading,
}) {
  const [showOptions, setShowOptions] = useState(false)
  const [buttonMode, setButtonMode] = useState(options[0])

  useEffect(() => {
    onChangeMode(buttonMode)
  }, [buttonMode, onChangeMode])

  return (
    <Container
      width={width}
      style={{
        marginTop: marginTop || 'auto',
        marginBottom: marginBottom || 'auto',
      }}
    >
      <ButtonContainer $activeDropdown={showOptions}>
        <Button
          className='main-button'
          width='100%'
          borderTopRightRadius={0}
          borderBottomRightRadius={0}
          zIndex='inherit'
          onClick={() => onClick(buttonMode)}
          appearance={theme}
          isLoading={isLoading}
        >
          {buttonMode}
        </Button>
        <Button
          className='caret-button'
          borderTopLeftRadius={0}
          borderBottomLeftRadius={0}
          borderLeft='none'
          outline='none'
          width='100%'
          paddingX='5px'
          zIndex='inherit'
          onClick={() => setShowOptions((prev) => !prev)}
          disabled={isLoading}
        >
          <CaretDownIcon />
        </Button>
      </ButtonContainer>
      {showOptions && (
        <OptionsContainer elevation={3}>
          {options.map((o) => (
            <Option
              key={o}
              onClick={() => {
                setButtonMode(o)
                setShowOptions(false)
                onChangeMode(o)
              }}
            >
              {o}
            </Option>
          ))}
        </OptionsContainer>
      )}
      {showOptions && <Backdrop onClick={() => setShowOptions(false)} />}
    </Container>
  )
}

SplitButton.propTypes = {
  /* Function called when the selected button is clicked. */
  onClick: PropTypes.func.isRequired,

  /* Function called when the current mode is changed. */
  onChangeMode: PropTypes.func,

  /* The possible button choices in the dropdown. The first item is the default button. */
  options: PropTypes.arrayOf(PropTypes.string).isRequired,

  /* Whether or not the button should display a loading indicator. */
  isLoading: PropTypes.bool,

  /* The width of the entire component. */
  width: PropTypes.string.isRequired,

  /* The appearance of the button, either primary or secondary. (default secondary) */
  theme: PropTypes.string,
}
