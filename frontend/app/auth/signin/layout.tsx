import { FC, PropsWithChildren } from "react"

const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="w-full overflow-hidden mx-auto">
      {children}
    </main>
  );
}

export default LoginLayout;