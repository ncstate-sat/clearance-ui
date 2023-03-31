import { Text } from 'evergreen-ui'
import styled from 'styled-components'
import DatePicker from 'react-datepicker'

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 16px 1fr 1fr 1fr 16px 1fr 1fr;
  grid-template-rows: auto 16px auto;
  padding-top: 2rem;
`

const LeftCaption = styled.div`
  grid-column-start: 1;
  grid-column-end: 5;
  grid-row-start: 1;
  grid-row-span: 1;
  transform: ${(props) => (props.shouldMoveIn ? 'translateX(63%)' : '0')};
  transition: transform 0.25s ease;
`

const RightCaption = styled.div`
  grid-column-start: 6;
  grid-column-end: 10;
  grid-row-start: 1;
  grid-row-span: 1;
  text-align: right;
  transform: ${(props) => (props.shouldMoveIn ? 'translateX(-63%)' : '0')};
  transition: transform 0.25s ease;
`

const VerticalCenter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  grid-column-start: ${(props) => props.colStart};
  grid-column-end: ${(props) => props.colEnd};
  grid-row-start: 2;
  grid-row-span: 1;
`

const LeftLine = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(105, 111, 140, 1) 100%
  );
  opacity: ${(props) => (props.inactive ? '0' : '100%')};
  transition: opacity 0.25s ease;
`

const CenterLine = styled.div`
  background-color: ${(props) => (props.inactive ? '#E6E8F0' : '#696f8c')};
  width: 100%;
  height: ${(props) => (props.inactive ? '1px' : '2px')};
`

const RightLine = styled.div`
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(105, 111, 140, 1) 0%,
    rgba(0, 0, 0, 0) 100%
  );
  opacity: ${(props) => (props.inactive ? '0' : '100%')};
  transition: opacity 0.25s ease;
`

const checkbox = styled.div`
  box-sizing: border-box;
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #cc0000;
  border-radius: 12px;
  cursor: pointer;
  background-color: white;
  display: absolute;

  &:hover {
    border: 4px solid #cc0000;
    background-color: white;
  }
`

const StartCheckbox = styled(checkbox)`
  background-color: ${(props) => (props.isChecked ? '#cc0000' : 'white')};
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-span: 1;
`

const EndCheckbox = styled(checkbox)`
  background-color: ${(props) => (props.isChecked ? '#cc0000' : 'white')};
  grid-column-start: 7;
  grid-column-end: 8;
  grid-row-start: 2;
  grid-row-span: 1;
`

const LeftDateText = styled.div`
  text-align: center;
  padding 4px;
  grid-column-start: 2;
  grid-column-end: 5;
  grid-row-start: 3;
  grid-row-end: 4;
`

const RightDateText = styled.div`
  text-align: center;
  padding 4px;
  grid-column-start: 6;
  grid-column-end: 9;
  grid-row-start: 3;
  grid-row-end: 4;
`

export default function Timeframe({
  startDateTime,
  endDateTime,
  onChangeStartTime,
  onChangeEndTime,
}) {
  return (
    <Container>
      <LeftCaption shouldMoveIn={startDateTime}>
        <Text>Start</Text>
      </LeftCaption>
      <RightCaption shouldMoveIn={endDateTime}>
        <Text>End</Text>
      </RightCaption>
      <VerticalCenter colStart={1} colEnd={3}>
        <LeftLine inactive={startDateTime} />
      </VerticalCenter>
      <StartCheckbox
        isChecked={startDateTime}
        onClick={() =>
          onChangeStartTime(startDateTime ? undefined : new Date())
        }
      />
      <VerticalCenter colStart={4} colEnd={7}>
        <CenterLine />
      </VerticalCenter>
      <EndCheckbox
        isChecked={endDateTime}
        onClick={() => onChangeEndTime(endDateTime ? undefined : new Date())}
      />
      <VerticalCenter colStart={8} colEnd={10}>
        <RightLine inactive={endDateTime} />
      </VerticalCenter>
      <LeftDateText>
        {startDateTime && (
          <DatePicker
            className='no-border center'
            selected={startDateTime}
            onChange={onChangeStartTime}
            showTimeSelect
            timeIntervals={15}
            timeFormat='h:mm aa'
            dateFormat='MM-dd-yyyy h:mm aa'
            autoFocus
          />
        )}
      </LeftDateText>
      <RightDateText>
        {endDateTime && (
          <DatePicker
            className='no-border center'
            selected={endDateTime}
            onChange={onChangeEndTime}
            showTimeSelect
            timeIntervals={15}
            timeFormat='h:mm aa'
            dateFormat='MM-dd-yyyy h:mm aa'
            autoFocus
          />
        )}
      </RightDateText>
    </Container>
  )
}
