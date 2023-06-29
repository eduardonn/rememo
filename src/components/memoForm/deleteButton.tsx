import { Button } from "@mui/material";
import { Memo, MemoEditOnConfirm } from "../memoTab";

interface DeleteButtonProps {
  onConfirm: MemoEditOnConfirm
  memoInfo?: Memo
}

export const DeleteButton = ({ onConfirm, memoInfo } : DeleteButtonProps) => {
  async function deleteMemo(id: number) {
    const res = await fetch('/api/memo', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
  
    return res.status;
  }
  
  return (
    <Button
      sx={{ position: 'absolute', right: '2%'}}
      onClick={() => {
        deleteMemo(memoInfo ? memoInfo.id : -1)
        onConfirm('DELETE', memoInfo);
      }}
    >
      Delete
    </Button>
  );
}