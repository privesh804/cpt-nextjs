import { type ReactNode } from "react";
import Navbar from "../common/navbar";

export interface TPageContainerProps {
  children?: ReactNode;
}

const Container = ({ children }: TPageContainerProps) => {
  return (
    <div className="border overflow-auto bg-tertiary-100 border-tertiary p-10 rounded-3xl w-full h-full min-h-[calc(100svh-4rem)]">
      {children}
    </div>
  );
};

export default Container;
