import { MutableRefObject, useEffect, useRef, useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

interface MemoTypeToggleProps {
  selectedMemoType: string,
  onChangeEvent: (e: React.MouseEvent<HTMLElement, MouseEvent>, value: string) => void | undefined
}

export default function MemoTypeToggle({ selectedMemoType, onChangeEvent }: MemoTypeToggleProps) {
  return (
    <ToggleButtonGroup
      value={selectedMemoType}
      exclusive
      onChange={onChangeEvent}
      aria-label="platform"
    >
      <ToggleButton value="text">Text</ToggleButton>
      <ToggleButton value="drawing">Drawing</ToggleButton>
      <ToggleButton value="Q&A">Q&A</ToggleButton>
    </ToggleButtonGroup>
  )
}