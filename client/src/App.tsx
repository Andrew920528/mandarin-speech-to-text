import FileUpload from "./Tabs/FileUpload";
import "./styles/reset.css";
import "./styles/app.css";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { MemoizedTabPanel, TabPanel } from "./components/TabPanel";
import { RetrieveText } from "./Tabs/RetrieveText";

const LOCAL_HOST = "http://127.0.0.1:8000";
const SERVER_HOST = "http://172.17.1.13:8000";

export let HOST = LOCAL_HOST;

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <div className="app">
      <h1>Speech To Text Transcriber</h1>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
        indicatorColor="primary"
      >
        <Tab label="Speech Upload" {...a11yProps(0)} />
        <Tab label="Retrieve Text" {...a11yProps(0)} />
      </Tabs>

      <div className="tab-panels">
        <MemoizedTabPanel index={0} value={value}>
          <FileUpload />
        </MemoizedTabPanel>
        <MemoizedTabPanel index={1} value={value}>
          <RetrieveText />
        </MemoizedTabPanel>
      </div>
    </div>
  );
}

export default App;
