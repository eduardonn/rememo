import { Button } from "@mui/material";
import { Memo, MemoEditOnConfirm } from '../memoTab';
import React from "react";

async function handleOnConfirm(formInfo: Memo, isUpdating: boolean) {
  let res;

  if (isUpdating) {
    res = await fetch('/api/memo', {
      method: 'PUT',
      body: JSON.stringify(formInfo)
    });
  } else {
    res = await fetch('/api/memo', {
      method: 'POST',
      body: JSON.stringify(formInfo)
    });
    
    const newMemoId = (await res.json()).data.id;
    formInfo.id = newMemoId;
  }

  return res.status;
}

interface ConfirmButtonProps {
  memoId?: number
  title: string
  description: string
  category: string
  selectedMemoLevel: number
  onConfirm: MemoEditOnConfirm
  isUpdating: boolean
}

export const ConfirmButton = (
  { memoId, title, description, category, selectedMemoLevel, onConfirm, isUpdating } : ConfirmButtonProps
) => {
  return (
    <Button
      sx={{ width: '100%', mt: 'auto'}}
      variant='contained'
      onClick={async () => {
        const memo = {
          id: memoId ? memoId : -1,
          title: title,
          description: description,
          category: category,
          memo_level: selectedMemoLevel
        }
        const status = await handleOnConfirm(
          memo,
          isUpdating
        );
        if (status === 201 || status === 200)
          onConfirm(isUpdating ? 'UPDATE' : 'INSERT', memo);
        else
          onConfirm('ERROR', memo);
      }}
    >
      Confirm
    </Button>
  )
}