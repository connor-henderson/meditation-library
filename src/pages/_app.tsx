import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const t = "test me for how long";
  const exentend_name = t.split("").forEach((settingsomelongname: string) => {
    const t = "test";
    const x = "hellot";
    return settingsomelongname;
  });
  return <Component {...pageProps} />;
}
