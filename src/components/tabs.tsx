import { useState } from 'react'
import { Tabs } from '@mui/material'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface TabContentProps {
  label: string
}

function TabContent(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    value === index ?
      <Box
        sx={{ p: 3 }}
        role="Tab panel"
        hidden={value !== index}
        {...other}
      >
        {children}
      </Box>
    : <></>
  );
}

interface MainTabsProps {
  children: React.ReactElement[]
}

export default function MainTabs({ children }: MainTabsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs value={value} onChange={handleChange} aria-label='Main tabs'>
        {children.map((child, i) => (
          <Tab key={i} label={child.props.label} />
        ))}
      </Tabs>

      {children.map((child, i) => (
        <TabContent key={i} value={value} index={i}>{ child }</TabContent>
      ))}
    </>
  )
}