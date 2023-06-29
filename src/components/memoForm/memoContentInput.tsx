import { MutableRefObject, useEffect, useRef, useState } from "react";
import {
  Modal, Stack, ToggleButton, ToggleButtonGroup, Typography,
  Button, TextField, Autocomplete,
} from "@mui/material";
import { Memo } from '../memoTab';

interface MemoInputProps {
  memoInfo: Memo | undefined
  titleRef: MutableRefObject<string>
  descriptionRef: MutableRefObject<string>
  selectedMemoType: string
}

export default function MemoContentInput(
  { memoInfo, titleRef, descriptionRef, selectedMemoType }: MemoInputProps) {
  return (
    selectedMemoType === 'text' ?
      <>
        <TextField
          id='title-memo-field'
          label='Title'
          defaultValue={memoInfo?.title}
          onChange={e => titleRef.current = e.target.value}
          variant='outlined'
          multiline={true}
          maxRows={4}
        />
        <TextField
          id='description-memo-field'
          label='Description'
          defaultValue={memoInfo?.description}
          onChange={e => descriptionRef.current = e.target.value}
          variant='outlined'
          multiline={true}
          minRows={2}
          maxRows={4}
        />
      </>
    :
    <Typography>Canvas Placeholder</Typography>
  )
}