import { useState, useEffect, useRef, Fragment } from 'react'
import { Pane, CrossIcon, CaretDownIcon } from 'evergreen-ui'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const cloneDeep = (object) => JSON.parse(JSON.stringify(object))

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
`

const Container = styled.div`
  position: relative;
  z-index: ${({ $showDropdown }) => ($showDropdown ? '5' : '1')};
  width: ${({ $width }) => $width};
`

const TagInputBox = styled.div`
  border: 1px solid #d8dae5;
  border-radius: 4px;
  padding: 4px;
  z-index: 5;
  background-color: white;
  cursor: text;
`

const Tag = styled.div`
  display: inline-block;
  margin: 6px 8px;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgb(237, 239, 245);
  color: rgb(71, 77, 102);
  cursor: pointer;
  z-index: 1;
  font-size: 11.5px;
  font-family: 'SF UI Text', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
`

const TextInput = styled.input`
  outline: none;
  padding: 4px;
  padding-left: 12px;
  border: none;
  z-index: 0;
  background-color: transparent;
  margin: 0;
  font-size: 12px;
  color: rgb(71, 77, 102);
`

const DropdownToggleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  position: absolute;
  top: 0;
  right: 4px;
  bottom: 0;
  width: 1.25rem;
`

const DropdownToggle = styled.button`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  appearance: none;
  background-color: rgb(192, 192, 192);
  border: none;
  border-radius: 4px;
  padding: 0;
`

const SuggestionContainer = styled.div`
  position: absolute;
  background-color: transparent;
  display: grid;
  grid-template-rows: auto auto;
  width: 100%;
  margin-top: 4px;
  z-index: 5;
`

const Suggestion = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  font-family: 'SF UI Text', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 12px;
  font-weight: 400;
  color: rgb(71, 77, 102);
  background-color: ${({ $highlighted }) =>
    $highlighted ? 'rgb(237, 239, 245)' : 'inherit'};

  &:not(:first-of-type) {
    border-top: 1px solid rgb(237, 239, 245);
  }

  &:hover {
    background-color: rgb(237, 239, 245);
  }
`

const NoResults = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 4rem;
  color: #d8dae5;
  user-select: none;
  font-family: 'SF UI Text', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol';
  font-size: 12px;
  font-weight: 400;
`

const SuggestionOption = ({ text, onSelect, highlighted }) => {
  const ref = useRef()

  if (highlighted && ref.current) {
    ref.current.scrollIntoView({ block: 'nearest' })
  }

  return (
    <Suggestion
      $highlighted={highlighted}
      onClick={() => onSelect(text)}
      data-testid={text}
      ref={ref}
    >
      {text}
    </Suggestion>
  )
}

SuggestionOption.propTypes = {
  /* Text to appear in the suggestion. */
  text: PropTypes.string.isRequired,

  /* Function which is called when a suggestion is selected. */
  onSelect: PropTypes.func.isRequired,

  /* Whether or not the suggestion should be highlighted. */
  highlighted: PropTypes.bool,
}

const TagInput = ({
  value,
  onChange,
  suggestions,
  placeholder,
  inputValue,
  onInputChange,
  width,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [highlightedSuggestion, setHighlightedSuggestion] = useState(null)
  const inputRef = useRef()

  const multipleAllowed = Array.isArray(value) ? true : false

  useEffect(() => {
    if (!showSuggestions) {
      setHighlightedSuggestion(null)
    }
  }, [showSuggestions])

  // Render list of options for dropdown.
  let valueList = []
  if (multipleAllowed) {
    valueList = value.map((v) => JSON.stringify(v))
  } else {
    valueList =
      value === null || value === undefined ? [] : [JSON.stringify(value)]
  }
  const filteredSuggestions = suggestions
    .filter((s) => !valueList.includes(JSON.stringify(s))) // Filter out suggestions that have already been selected
    .filter((s) =>
      s.text.toLowerCase().includes((inputValue || '').toLowerCase())
    ) // Filter out suggestions that don't match the query

  let suggestionItems = filteredSuggestions.map((s, i) => {
    return (
      <SuggestionOption
        text={s.text}
        onSelect={() => selectOptionHandler(s)}
        highlighted={i === highlightedSuggestion}
        key={s.text}
      />
    )
  })

  // Select option from dropdown.
  const selectOptionHandler = (selectedOption) => {
    if (multipleAllowed) {
      onChange([...cloneDeep(value), cloneDeep(selectedOption)])
      if (suggestions.length <= 1) {
        setShowSuggestions(false)
      }
    } else {
      onChange(cloneDeep(selectedOption))
      setShowSuggestions(false)
      setHighlightedSuggestion(null)
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
    onInputChange('')
  }

  // Select all options from dropdown.
  const selectAllHandler = () => {
    if (multipleAllowed) {
      const allSuggestions = suggestions.filter((s) =>
        s.text.toLowerCase().includes(inputValue.toLowerCase())
      )
      onChange(cloneDeep(allSuggestions))
      setShowSuggestions(false)
      setHighlightedSuggestion(null)
      if (inputRef.current) {
        inputRef.current.blur()
      }
    } else if (filteredSuggestions.length > 0) {
      selectOptionHandler(filteredSuggestions[0])
    }
    onInputChange('')
  }

  // Handle backspace to remove selected options.
  const typedInputHandler = (event) => {
    if (
      event.key === 'Backspace' &&
      inputValue.length === 0 &&
      multipleAllowed
    ) {
      event.preventDefault()
      const newArray = [...value]
      newArray.pop()
      onChange(newArray)
    } else if (event.key === 'Tab') {
      event.preventDefault()
      if (highlightedSuggestion !== null) {
        selectOptionHandler(filteredSuggestions[highlightedSuggestion])
      } else if (
        highlightedSuggestion === null &&
        filteredSuggestions.length > 0
      ) {
        setHighlightedSuggestion(0)
      }
    } else if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault()
      selectAllHandler()
      setShowSuggestions(false)
      setHighlightedSuggestion(null)
      if (inputRef.current) {
        inputRef.current.blur()
      }
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      if (highlightedSuggestion === null && filteredSuggestions.length > 0) {
        setHighlightedSuggestion(0)
      } else if (highlightedSuggestion !== null) {
        selectOptionHandler(filteredSuggestions[highlightedSuggestion])
        setShowSuggestions(false)
        setHighlightedSuggestion(null)
        if (inputRef.current) {
          inputRef.current.blur()
        }
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlightedSuggestion((hs) => {
        if (filteredSuggestions.length > 0) {
          if (hs === null) {
            return 0
          } else if (hs >= filteredSuggestions.length - 1) {
            return 0
          } else {
            return hs + 1
          }
        } else {
          return null
        }
      })
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlightedSuggestion((hs) => {
        if (filteredSuggestions.length > 0) {
          if (!hs) {
            return filteredSuggestions.length - 1
          } else if (hs > 0) {
            return hs - 1
          } else {
            return filteredSuggestions.length - 1
          }
        } else {
          return null
        }
      })
    }
  }

  // Remove option by clicking on it.
  const removeOption = (option) => {
    if (multipleAllowed) {
      const newArray = [...value].filter((v) => v !== option)
      onChange(newArray)
    } else if (value === option) {
      onChange(null)
    }
  }

  const focusInputHandler = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    } else {
      setShowSuggestions(true)
    }
  }

  // Render selected options.
  let selectedOptions = []
  if (multipleAllowed) {
    selectedOptions = value.map((v) => (
      <Tag onClick={() => removeOption(v)} key={v.text}>
        {v.text}
        <CrossIcon
          size={10}
          style={{ transform: 'translateX(4px) translateY(1px)' }}
        />
      </Tag>
    ))
  } else if (value) {
    selectedOptions = [
      <Tag onClick={() => removeOption(value)} key={value.text}>
        {value.text}
        <CrossIcon
          size={10}
          style={{ transform: 'translateX(4px) translateY(1px)' }}
        />
      </Tag>,
    ]
  }

  return (
    <Container $showDropdown={showSuggestions} $width={width}>
      {showSuggestions && inputValue.length > 0 ? (
        <Backdrop
          onClick={() => setShowSuggestions(false)}
          data-testid='suggestion-box-backdrop'
        ></Backdrop>
      ) : null}
      <TagInputBox onClick={focusInputHandler}>
        {selectedOptions}
        {multipleAllowed || (!multipleAllowed && !value) ? (
          <TextInput
            type='text'
            value={inputValue}
            placeholder={placeholder || ''}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={typedInputHandler}
            onFocus={() => setShowSuggestions(true)}
            ref={inputRef}
          />
        ) : null}
        {showSuggestions && suggestions.length > 0 ? (
          <DropdownToggleContainer>
            <DropdownToggle>
              <CaretDownIcon size={14} color='muted' />
            </DropdownToggle>
          </DropdownToggleContainer>
        ) : null}
      </TagInputBox>
      {showSuggestions && inputValue.length > 0 ? (
        <SuggestionContainer>
          <Pane
            elevation={3}
            backgroundColor='white'
            maxHeight='12.5rem'
            overflowY='scroll'
          >
            {suggestionItems.length > 0 ? (
              suggestionItems
            ) : (
              <NoResults>No Results</NoResults>
            )}
          </Pane>
        </SuggestionContainer>
      ) : null}
    </Container>
  )
}

TagInput.propTypes = {
  /* The currently selected tags. As an array if multiple options can be selected. `text` represents what will appear in the tag, and `raw` represents the data behind that tag. */
  value: PropTypes.oneOfType([
    PropTypes.shape({ raw: PropTypes.object, text: PropTypes.string }),
    PropTypes.arrayOf(
      PropTypes.shape({ raw: PropTypes.object, text: PropTypes.string })
    ),
  ]),

  /* Function that is called whenever the selected tags have changed. */
  onChange: PropTypes.func.isRequired,

  /* The text input for searching tags. */
  inputValue: PropTypes.string,

  /* Function called when text input changes. */
  onInputChange: PropTypes.func,

  /* An array of suggestions to appear in the dropdown. */
  suggestions: PropTypes.arrayOf(
    PropTypes.shape({ raw: PropTypes.object, text: PropTypes.string })
  ).isRequired,

  /* Optional placeholder text to appear in the input. */
  placeholder: PropTypes.string,

  /* Width of the input. */
  width: PropTypes.string,
}

export const createTagOption = (tagTitle, rawData) => ({
  text: tagTitle,
  raw: rawData,
})

export default TagInput
