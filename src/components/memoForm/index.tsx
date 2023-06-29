import { useRef, useState } from "react";
import { Modal, Stack,Typography } from "@mui/material";
import { Memo, MemoEditOnConfirm } from '../memoTab';
import LevelOptionsInput from "./memoLevelOptionInput";
import MemoTypeToggle from "./memoTypeToggle";
import CategoryInput from "./memoCategoryInput";
import MemoContentInput from "./memoContentInput";
import { DeleteButton } from "./deleteButton";
import { ConfirmButton } from "./memoConfirmButton";

interface MemoEditModalProps {
  memoInfo?: Memo
  isOpen: boolean
  isUpdating: boolean
  onClose: () => void
  onConfirm: MemoEditOnConfirm
}

export default function MemoFormModal(
  { memoInfo, isOpen, isUpdating, onClose, onConfirm } : MemoEditModalProps)
{
  const [selectedMemoLevel, setSelectedMemoLevel] = useState(memoInfo ? memoInfo.memo_level : 1);
  const [selectedMemoType, setSelectedMemoType] = useState('text');
  const titleRef = useRef<string>(memoInfo ? memoInfo.title : '');
  const descriptionRef = useRef<string>(memoInfo ? memoInfo.description : '');
  const categoryRef = useRef<string | undefined>(memoInfo?.category);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-label='Memo form'
      disableScrollLock
    >
      <Stack sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          minWidth: '60vw', height: '90vh', border: 3, borderRadius: 2, p: 3,
          bgcolor: 'background.default', overflow: 'auto',
        }}
        gap='20px'
      >
        <Typography variant='h5' align='center'>
          {isUpdating ? 'Update' : 'Add'} Memo
        </Typography>
        {isUpdating &&
          <DeleteButton memoInfo={memoInfo} onConfirm={onConfirm} />
        }
        <Stack direction='row' justifyContent='space-between'>
          <Stack direction='row' gap='20px'>
            <Typography alignSelf='center'>Memo type</Typography>
            <MemoTypeToggle
              selectedMemoType={selectedMemoType}
              onChangeEvent={(_, value) => setSelectedMemoType(value)}
            />
          </Stack>
          <CategoryInput
            defaultValue={categoryRef.current}
            onChange={value => categoryRef.current = value}
          />
        </Stack>
        <MemoContentInput
          memoInfo={memoInfo}
          titleRef={titleRef}
          descriptionRef={descriptionRef}
          selectedMemoType={selectedMemoType}
        />
        <Stack gap='3px'>
          <Typography>Memo&nbsp;level</Typography>
          <LevelOptionsInput
            selectedMemoLevel={selectedMemoLevel}
            onClick={(value) => setSelectedMemoLevel(value)}
          />
        </Stack>
        <ConfirmButton
          memoId={memoInfo ? memoInfo.id : -1}
          title={titleRef.current}
          description={descriptionRef.current}
          category={categoryRef.current || ''}
          selectedMemoLevel={selectedMemoLevel}
          onConfirm={onConfirm}
          isUpdating={isUpdating}
        />
      </Stack>
    </Modal>
  )
}