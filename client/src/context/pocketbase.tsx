import PocketBase, { RecordAuthResponse, BaseModel } from "pocketbase";
import React, { useEffect, useState } from "react";

type Login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => Promise<RecordAuthResponse<BaseModel>>;

type Register = ({
  email,
  password,
  passwordConfirm,
}: {
  email: string;
  password: string;
  passwordConfirm: string;
}) => Promise<BaseModel>;

type Logout = () => void;

export const PocketBaseContext = React.createContext<{
  loading: boolean;
  pocketBase: PocketBase | undefined;
  auth: BaseModel | undefined;
  login: Login | undefined;
  register: Register | undefined;
  logout: Logout | undefined;
}>({
  loading: true,
  pocketBase: undefined,
  auth: undefined,
  login: undefined,
  register: undefined,
  logout: undefined,
});

export function PocketBaseProvider(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [pocketBase, setPocketBase] = useState<PocketBase>();
  const [auth, setAuth] = useState<BaseModel>();

  useEffect(() => {
    const _pocketBase = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    setPocketBase(_pocketBase);

    const unsubscribe = _pocketBase.authStore.onChange((_token, auth) => {
      setAuth(auth as BaseModel);
      setLoading(false);
    }, true);

    return () => {
      unsubscribe();
    };
  }, []);

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await pocketBase!
      .collection("users")
      .authWithPassword(email, password);
    pocketBase!.authStore.exportToCookie();
    return user;
  }

  async function register({
    email,
    password,
    passwordConfirm,
  }: {
    email: string;
    password: string;
    passwordConfirm: string;
  }) {
    const user = await pocketBase!.collection("users").create({
      email: email,
      password: password,
      passwordConfirm: passwordConfirm,
    });
    return user;
  }

  function logout() {
    pocketBase?.authStore.clear();
    pocketBase?.authStore.exportToCookie();
  }

  return (
    <PocketBaseContext.Provider
      value={{ loading, pocketBase, auth, login, register, logout }}>
      {props.children}
    </PocketBaseContext.Provider>
  );
}
