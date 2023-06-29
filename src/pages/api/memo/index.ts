import { Memo } from '@/components/memoTab';
import generateWeightedRandomizer from '@/lib/weightedRandomizer';
import type { NextApiRequest, NextApiResponse } from 'next'
import sql from '../../../lib/db';

interface Data {
  status?: number
  data: string | any
}

const NUM_RESULTS_PER_REQUEST = 25;

const getRandomMemoLevel = generateWeightedRandomizer([4, 3, 2, 1, 0]);

function getReviewMemoArray(memoByLevels: Array<Array<Memo>>) {
  const memoByLevelsLengths = memoByLevels.map(v => v.length);
  const memosArray = [];
  let previousMemo = { id: -1 };
  
  for (let i = 0; i < NUM_RESULTS_PER_REQUEST; ++i) {
    let levelSelected = getRandomMemoLevel();

    // If there isn't any memos in the selected level, go through the next ones
    // If there isn't any memos at all, return null
    let levelPreviouslySelected = levelSelected;
    while (memoByLevelsLengths[levelSelected] === 0) {
      levelSelected = (levelSelected + 1) % memoByLevels.length;
      if (levelPreviouslySelected === levelSelected) return null;
    }

    let memoSelectedIndex = Math.floor(Math.random() * memoByLevelsLengths[levelSelected]);
    let memoSelected = memoByLevels[levelSelected][memoSelectedIndex];

    // Don't show the same memo twice
    while (memoSelected.id === previousMemo.id) {
      // Select next memo in the levelSelected array
      if (memoByLevelsLengths[levelSelected] === 1) {
        levelSelected = (levelSelected + 1) % memoByLevels.length;
        memoSelectedIndex = Math.floor(Math.random() * memoByLevelsLengths[levelSelected]);
        memoSelected = memoByLevels[levelSelected][memoSelectedIndex];
      } else {
        memoSelected = memoByLevels[levelSelected][(memoSelectedIndex + 1) % memoByLevelsLengths[levelSelected]];
      }
    }

    previousMemo = memoSelected;
    memosArray.push(memoSelected);
  }
  return memosArray;
}

type QueryMemosOptions = { orderby?: any, type?: any };

export async function queryMemos(options? : QueryMemosOptions) {
  let data;

  if (options?.orderby)
    switch (options?.orderby) {
      case 'title':
      case 'description':
      case 'category':
      case 'memo_level':
        data = await sql`SELECT * FROM memosText ORDER BY ${sql(options?.orderby)}`;
    }
  else if (options?.type === 'review') {
    const memoByLevels = new Array(5);
    await Promise.all([
      memoByLevels[0] = await sql`SELECT * FROM memosText WHERE memo_level = 1`,
      memoByLevels[1] = await sql`SELECT * FROM memosText WHERE memo_level = 2`,
      memoByLevels[2] = await sql`SELECT * FROM memosText WHERE memo_level = 3`,
      memoByLevels[3] = await sql`SELECT * FROM memosText WHERE memo_level = 4`,
      memoByLevels[4] = await sql`SELECT * FROM memosText WHERE memo_level = 5`,
    ]);
    
    data = getReviewMemoArray(memoByLevels);
    if (!data) {
      return null;
    }
  }
  else {
    data = await sql`SELECT * FROM memosText`;
    data = Array.from(data) as Array<Memo>;
  }
  return data;
}

async function handleGET(req: NextApiRequest, res: NextApiResponse<Data>) {
  const data = queryMemos({ orderby: req.query.orderby, type: req.query.type });
  if (!data) res.status(404).json({ data: 'No memos were found' });
  res.status(200).json({ data });
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse<Data>) {
  const queryData = JSON.parse(req.body);
      
  const rows = await sql`
    INSERT INTO memosText
    ${sql(queryData, 'title', 'description', 'category', 'memo_level')}
    RETURNING ID
  `;
  res.status(201).json({ data: rows.at(0) });
}

async function handlePUT(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.body) {
    const queryData = JSON.parse(req.body);
    
    await sql`
      UPDATE memosText
      SET
        title = ${queryData.title},
        description = ${queryData.description},
        category = ${queryData.category},
        memo_level = ${queryData.memo_level}
      WHERE id = ${queryData.id}
    `;

    res.status(200).json({ data: `Memo with id = ${queryData.id} updated` });
    
    return;
  }

  if (typeof req.query.update_memo_level_id === 'number'
    && typeof req.query.update_memo_level === 'number') {
    await sql`
      UPDATE memosText
      SET
        memo_level = ${req.query.memo_level!}
      WHERE id = ${req.query.update_memo_level_id}
    `;
    
    res.status(200).json({ data: `Memo with id = ${req.query.update_memo_level_id} updated` });

    return;
  }

  res.status(400).json({ data: `Bad request` });
}

async function handleDELETE(req: NextApiRequest, res: NextApiResponse<Data>) {
  const queryData = JSON.parse(req.body);

  if (typeof queryData.id === 'number')
    await sql`
      DELETE FROM memosText
      WHERE id = ${queryData.id}
    `;
  
  res.status(201).json({ data: `Memo with id = ${queryData.id} deleted` });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case 'POST':
      await handlePOST(req, res);
      break;
    case 'GET':
      await handleGET(req, res);
      break;
    case 'PUT':
      await handlePUT(req, res);
      break;
    case 'DELETE':
      await handleDELETE(req, res);
      break;
    default:
      res.status(405).json({ data: `Method ${req.method} not allowed`});
  }
}
