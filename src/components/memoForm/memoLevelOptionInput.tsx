import { Stack, Typography, Button } from "@mui/material";

interface LevelOptionProps {
  value: number
  text: string
  selectedMemoLevel: number
  onClick: (value: number) => void
}

function LevelOptionStyle(bgcolor: string) {
  return {
    borderRadius: '5px', width: '100%', height: '2.5rem',
    bgcolor: bgcolor,
    '&:hover': {
      bgcolor: bgcolor,
      boxShadow: '0 0 3px 3px white'
    }
  };
}

function LevelOption({value, text, selectedMemoLevel, onClick} : LevelOptionProps) {
  return (
    <Button
        onMouseDown={() => onClick(value)}
        sx={[
          LevelOptionStyle('memoLevels.' + value),
          selectedMemoLevel === value && {
            boxShadow: '0 0 3px 4px white'
          }
        ]}>
      <Typography align='center' sx={{ textShadow: '0 0 5px black' }}>{text}</Typography>
    </Button>
  )
}

export default function LevelOptionsInput({selectedMemoLevel, onClick }
  : Pick<LevelOptionProps, 'selectedMemoLevel' | 'onClick'>)
{
  return (
    <Stack gap='3px'>
      <Stack direction='row' gap='10px'>
        {[1, 2, 3, 4, 5].map(v => 
          <LevelOption
            key={v}
            value={v}
            text={v.toString()}
            selectedMemoLevel={selectedMemoLevel}
            onClick={onClick}
          />
        )}
      </Stack>
      <Stack direction='row' justifyContent='space-between'>
        <Typography variant='caption'>Will likely forget</Typography>
        <Typography variant='caption'>Will never forget!</Typography>
      </Stack>
    </Stack>
   )
}