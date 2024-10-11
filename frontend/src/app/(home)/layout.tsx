import { PropsWithChildren } from "react";
import Navbar from "../_components/navbar";

export default function layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
