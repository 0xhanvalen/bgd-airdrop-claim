import "../styles/globals.css";
import { EthersContextFC } from "../contexts/EthersProviderContext";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Toaster />
      <EthersContextFC>
        <Component {...pageProps} />
      </EthersContextFC>
    </>
  );
}

export default MyApp;
