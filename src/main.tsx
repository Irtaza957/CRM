import App from "./App.tsx";
import "./assets/css/index.css";
import store from "./store/index.ts";

import { Toaster } from "sonner";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          className: "p-3",
        }}
      />
      <App />
    </Router>
  </Provider>
);
