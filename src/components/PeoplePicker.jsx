import { useMemo } from 'react'
import { Pane, Card, Heading, Button, TagInput, minorScale } from 'evergreen-ui'

import usePersonnel from '../hooks/usePersonnel'

export default function PeoplePicker({
  header,
  selectedPersonnel,
  setSelectedPersonnel,
}) {
  const { personnel, setPersonnelQuery } = usePersonnel()

  // Suggestion strings for personnel.
  const autocompletePersonnel = useMemo(() => {
    const personnelStrings = personnel.map(
      (p) =>
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
    )
    const selectedPersonnelStrings = selectedPersonnel.map(
      (p) =>
        `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`
    )
    return personnelStrings
      .filter((i) => !selectedPersonnelStrings.includes(i))
      .sort()
  }, [personnel, selectedPersonnel])

  return (
    <Card
      position='relative'
      padding={minorScale(6)}
      backgroundColor='white'
      marginY={minorScale(6)}
      elevation={0}
      border='muted'
    >
      <Pane display='flex' flexDirection='row' justifyContent='space-between'>
        <Heading size={600} marginBottom={minorScale(3)}>
          {header}
        </Heading>
        <Button
          onClick={() => {
            setSelectedPersonnel([])
            setPersonnelQuery('')
          }}
        >
          Clear
        </Button>
      </Pane>
      <TagInput
        tagSubmitKey='enter'
        width='100%'
        marginTop='8px'
        values={selectedPersonnel.map((p) =>
          `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`.trim()
        )}
        onChange={(selected) => {
          const personnelObjects = []
          const allPersonnel = [...personnel, ...selectedPersonnel]
          const personnelStrings = allPersonnel.map((p) =>
            `${p['first_name']} ${p['last_name']} (${p['email']}) [${p['campus_id']}]`.trim()
          )
          selected.forEach((s) => {
            const i = personnelStrings.indexOf(s)
            if (i >= 0) {
              personnelObjects.push(allPersonnel[i])
            }
          })
          setSelectedPersonnel(personnelObjects)
        }}
        autocompleteItems={autocompletePersonnel}
        onInputChange={(e) => setPersonnelQuery(e.target.value)}
      />
    </Card>
  )
}
