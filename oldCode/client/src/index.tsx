import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MantineProvider } from "@mantine/core";
import * as ReactRedux from "react-redux";
import { theme } from "./components/theme/theme";
import { reduxStore } from "./redux-store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ReactRedux.Provider store={reduxStore}>
      <BrowserRouter>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
          <App />
        </MantineProvider>
      </BrowserRouter>
    </ReactRedux.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
