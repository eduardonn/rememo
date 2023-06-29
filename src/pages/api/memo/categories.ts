import type { NextApiRequest, NextApiResponse } from 'next'
import sql from '../../../lib/db';

interface Data {
  status?: number
  data: string | any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const rows = await sql`
    SELECT category
    FROM memosText
    WHERE category != 'null'
    GROUP BY category
    ORDER BY category
  `;
  
  const keyValuePairs = Object.values(rows);
  const categoryArray = new Array(rows.count);
  keyValuePairs.forEach((v, i) => categoryArray[i] = v.category);

  res.status(200).json({ data: categoryArray });
}