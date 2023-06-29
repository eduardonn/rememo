import { Box, Slide, Stack, Typography } from "@mui/material";
import { Memo } from '../memoTab';
import LevelOptionsInput from '../memoForm/memoLevelOptionInput';
import { useRef, useState } from "react";

interface MemoViewContentProps {
  visible: boolean
  direction: 'left' | 'right'
  memo: Memo
  onInputSelect: (value: number) => void
}

const contentStyle = {
  border: '1px solid gray',
  borderRadius: '3px',
  p: 1.2,
}

async function updateMemo(id: number, newMemoLevel: number) {
  const url = new URL('http://localhost:3000/api/memo');
  url.searchParams.append('update_memo_level_id', String(id));
  url.searchParams.append('memo_level', String(newMemoLevel));

  let res = await fetch(url, { method: 'PUT' });

  return res.status;
}

function MemoViewContent({ visible, direction, memo, onInputSelect }: MemoViewContentProps) {
  return (
    <Slide direction={direction} in={visible}>
      <Stack gap='.5em' sx={{ position: 'absolute', width: '65vw', height: '80vh', p: 2 }}>
        <Typography>Title</Typography>
        <Typography sx={contentStyle}>{memo.title}</Typography>
        <Typography sx={{ mt: '.7em' }}>Description</Typography>
        <Typography sx={contentStyle}>{memo.description}</Typography>
        <Stack gap='1rem' sx={{ mt: 'auto' }}>
          <Typography variant='h6' sx={{ alignSelf: 'center' }}>Select new memo level</Typography>
          <LevelOptionsInput
            selectedMemoLevel={memo.memo_level}
            onClick={(value) => {
              onInputSelect(value);
            }}
          />
        </Stack>
      </Stack>
    </Slide>
  );
}

export default function MemoView({ memos }: { memos: Array<Memo> }) {
  // Alternate between two MemoViewContent components to create a slide effect
  const [memoOneInfo, setMemoOneInfo] = useState(memos[0]);
  const [memoTwoInfo, setMemoTwoInfo] = useState(memos[1]);

  const [currentMemoIndex, setCurrentMemoIndex] = useState(1);
  const [memoOneTurn, toggleMemoTurn] = useState(true);
  const previousMemoIndexRef = useRef(0);

  async function handleOnInputSelect(selectedMemoLevel: number) {
    // Update fetched memos locally
    const previousMemoId = memos[previousMemoIndexRef.current].id;
    memos.forEach(v => {
      if (previousMemoId === v.id) {
        v.memo_level = selectedMemoLevel;
      }
    });

    if (memoOneTurn) {
      setMemoTwoInfo(memos[currentMemoIndex]);
      setMemoOneInfo(state => ({ ...state, memo_level: selectedMemoLevel}));
    } else {
      setMemoOneInfo(memos[currentMemoIndex]);
      setMemoTwoInfo(state => ({ ...state, memo_level: selectedMemoLevel}));
    }

    updateMemo(memos[previousMemoIndexRef.current].id, selectedMemoLevel);
    previousMemoIndexRef.current = currentMemoIndex;
    setCurrentMemoIndex(state => {
      // TODO: Fetch more memos to review
      return (state + 1) % memos.length;
    });
    toggleMemoTurn(state => !state);
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <MemoViewContent
        visible={memoOneTurn}
        direction={memoOneTurn ? 'left' : 'right'}
        memo={memoOneInfo}
        onInputSelect={handleOnInputSelect}
      />
      <MemoViewContent
        visible={!memoOneTurn}
        direction={memoOneTurn ? 'right' : 'left'}
        memo={memoTwoInfo}
        onInputSelect={handleOnInputSelect}
      />
    </Box>
  );
}