import React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      style={{
        width: "100%",
        display: value === index ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
      }}
      {...other}
    >
      {children}
    </div>
  );
}

export const MemoizedTabPanel = React.memo(TabPanel);
