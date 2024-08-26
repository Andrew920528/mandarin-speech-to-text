import { ReactNode } from "react";
import "../styles/popup.css";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

export type PopUpProps = {
  trigger: boolean;
  setTrigger: (trigger: boolean) => void;
  reset?: () => void;
  title: string;
  children?: ReactNode;
};
const PopUp = ({ trigger, setTrigger, title, children }: PopUpProps) => {
  if (!trigger) return <></>;
  return (
    <div className={"pop-up-wrapper"}>
      <div className={"pop-up"}>
        <div className={"pop-up-header"}>
          <p className={"--heading"}>{title}</p>

          <IconButton
            onClick={() => {
              setTrigger(false);
            }}
          >
            <Close />
          </IconButton>
        </div>
        <div className={"pu-content"}>{children}</div>
      </div>
    </div>
  );
};

export default PopUp;
