import type { FC, PropsWithChildren } from "react";

const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
  return <main className="mx-auto w-full overflow-hidden">{children}</main>;
};

export default LoginLayout;
