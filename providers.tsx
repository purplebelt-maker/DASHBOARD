"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { ThemeProvider } from "@/contexts/ThemeContext";
import store, { AppDispatch } from "@/redux/store";
import { loadUser } from "@/redux/actions/authAction";
import Alert from "./components/Alert";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Alert placement="top" duration={3} />

        <AuthInitializer>{children}</AuthInitializer>
      </ThemeProvider>
    </Provider>
  );
}
