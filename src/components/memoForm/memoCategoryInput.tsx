import { useEffect, useRef, useState } from "react";
import { TextField, Autocomplete } from "@mui/material";

interface CategoryInputProps {
  defaultValue: string | undefined
  onChange: (value: string) => void
}

export default function CategoryInput({ defaultValue, onChange }: CategoryInputProps) {
  const [options, setOptions] = useState<Array<string>>([]);
  const isFetchingOptions = useRef(false);

  useEffect(() => {
    if (isFetchingOptions.current) return;

    isFetchingOptions.current = true;
    fetch('/api/memo/categories')
      .then(res => res.json())
      .then(value => setOptions(value.data))
      .catch(() => console.error('Categories fetch failed'))
      .finally(() => isFetchingOptions.current = false);
  }, []);

  return (
    <Autocomplete
      clearOnBlur={false}
      id='category-combo-box'
      sx={{ width: '32%' }}
      options={options}
      onInputChange={(_, value) => onChange(value as string)}
      defaultValue={defaultValue}
      renderInput={params =>
        <TextField {...params} label='Category'/>}
    />
  )
}