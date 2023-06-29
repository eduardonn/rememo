import { Box, CircularProgress } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Memo } from '../memoTab';
import MemoView from './memoView';
import { TabContentProps } from '../tabs';

function generateWeightsQuery(weights: number[]) {
  let queryString = String(weights[0]);
  for(let i = 1; i < weights.length; ++i) {
    queryString += '-' + weights[i];
  }
  return queryString;
}

export default function ReviewTab(_: TabContentProps) {
  const [memos, setMemos] = useState<Array<Memo>>();
  const isFetchingMemos = useRef(false);

  function fetchMemos() {
    if (isFetchingMemos.current) return;

    const weightsQuery = generateWeightsQuery([4, 3, 2, 1, 0]);

    const url = new URL('http://localhost:3000/api/memo');
    url.searchParams.append('type', 'review');
    url.searchParams.append('weights', weightsQuery);
    
    isFetchingMemos.current = true;
    fetch(url)
      .then(res => {
        if (!res.ok) throw res;
        if (res.status === 404) throw Error('No memo found');
        return res.json();
      })
      .then(value => {
        setMemos(value.data);
      })
      .catch(() => console.error('Memos fetch failed'))
      .finally(() => isFetchingMemos.current = false);
  }

  useEffect(fetchMemos, []);

  return (
    memos
    ?
      <MemoView
        memos={memos}
      />
    :
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
  )
}