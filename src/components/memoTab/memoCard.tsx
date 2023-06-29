import { Box, Card, Typography } from '@mui/material';
import { Memo } from '.';

interface MemoCardProps extends Memo {
  onClick: (props: Memo) => void
}

export default function MemoCard(props: MemoCardProps) {
  return (
    <Card
      onClick={() => props.onClick(props)}
      sx={{
        bgcolor: 'background.default', minWidth: '11.6rem', maxWidth: '11.6rem',
        alignSelf: 'center', p: .7, pb: 2, position: 'relative',
      }}
    >
      <Typography variant='h6'>{props.title}</Typography>
      <Typography variant='caption'>{props.description}</Typography>
      <Box 
        sx={{
          height: '10px', width: '120%', bgcolor: 'memoLevels.' + props.memo_level,
          position: 'absolute', bottom: '0', transform: 'translate(-10%, 0)',
        }}
      />
    </Card>
  );
}