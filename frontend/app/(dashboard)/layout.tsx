import { type FC, type PropsWithChildren } from "react";
import DashboardLayout from "@/component/DashboardLayout";

const DashboardHomeLayout: FC<PropsWithChildren> = async function ({ children }) {
  return (
    <DashboardLayout >{children}</DashboardLayout>
  );
};

export default DashboardHomeLayout;
