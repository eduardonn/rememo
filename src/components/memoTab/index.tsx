import { useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Fade, Stack } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import MemoFormModal from '../memoForm';
import MemoCard from './memoCard';
import { TabContentProps } from '../tabs';

export interface Memo {
  id: number
  title: string
  description: string
  type?: string
  category?: string
  memo_level: number
}

export type MemoEditOnConfirm =
  (operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'ERROR', memoInfo?: Memo) => void

interface ModalControllerInfo {
  isModalOpen: boolean
  isUpdating: boolean
  memoInfo?: Memo
}

type AlertSeverity = 'success' | 'error' | 'warning' | 'info'

interface AlertControllerInfo {
  visible: boolean
  msg: string
  severity: AlertSeverity
}

interface MemoTabProps extends TabContentProps {
  memoProp: Array<Memo>
}

export default function MemoTab({ memoProp } : MemoTabProps) {
  const [ memos, setMemos ] = useState<Array<Memo>>(memoProp);
  const [ modalControllerInfo, setModalControllerInfo] =
    useState<ModalControllerInfo>({ isModalOpen: false, isUpdating: false });
  const isFetchingMemos = useRef(false);
  const [alertControllerInfo, setAlertControllerInfo] = 
    useState<AlertControllerInfo>({visible: false, msg: 'Undefined msg', severity: 'error'});

  function showAlert(
    msg: string,
    severity: AlertSeverity,
    timeAliveMs: number = 3000,
  ) {
    setAlertControllerInfo({ visible: true, msg, severity });
    setTimeout(() => setAlertControllerInfo(state => ({ ...state, visible: false })), timeAliveMs)
  }

  const updateMemoListLocally: MemoEditOnConfirm = (operation, memo) => {
    if (memo && memos)
      switch (operation) {
        case 'INSERT':
          setMemos([ ...memos, memo ]);
          break;
        case 'UPDATE':
          setMemos([ ...memos.filter(value => value.id !== memo.id), memo ]);
          break;
        case 'DELETE':
          setMemos(state => state?.filter(value => value.id !== memo.id));
          break;
      }
  }

  return (
    <Stack gap={2}>
      <Button
        variant='outlined'
        sx={{ alignSelf: 'start' }}
        onClick={() => setModalControllerInfo({ isModalOpen: true, isUpdating: false })}
      >
        Add Memo
      </Button>
      {memos ?
        <>
          <Masonry sx={{ alignContent: 'center' }} spacing={2}>
            {memos.map(row => 
              <MemoCard
                key={row.id}
                id={row.id}
                title={row.title}
                type={row.type}
                category={row.category}
                memo_level={row.memo_level}
                description={row.description}
                onClick={
                  memoInfo => setModalControllerInfo(
                    { isModalOpen: true, isUpdating: true, memoInfo })
                }
              />
            )}
          </Masonry>
          {modalControllerInfo.isModalOpen &&
            <MemoFormModal
              isOpen={modalControllerInfo.isModalOpen}
              memoInfo={modalControllerInfo.memoInfo}
              isUpdating={modalControllerInfo.isUpdating}
              onClose={() => setModalControllerInfo(state => (
                { ...state, isModalOpen: false }))
              }
              onConfirm={(operation, memo) => {
                updateMemoListLocally(operation, memo);
                setModalControllerInfo(state => (
                  { ...state, isModalOpen: false })
                );
                switch (operation) {
                  case 'INSERT':
                    showAlert('Memo added', 'success');
                    break;
                  case 'UPDATE':
                    showAlert('Memo updated', 'success');
                    break;
                  case 'DELETE':
                    showAlert('Memo deleted', 'success');
                    break;
                  default:
                    showAlert('Something went wrong', 'error');
                    break;
                }
              }}
            />
          }
          <Fade in={alertControllerInfo.visible}>
            <Alert
              sx={{ position: 'fixed', bottom: 20, right: 30 }}
              onClose={() => {
                setAlertControllerInfo(state => ({ ...state, visible: false }))
              }}
            >{alertControllerInfo.msg}</Alert>
          </Fade>
        </>
      :
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>}
    </Stack>
  );
}