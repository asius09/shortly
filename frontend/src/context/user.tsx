"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { UserType } from "@/types/user.type";

type User = Omit<UserType, "password" | "createdAt" | "updatedAt"> | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
  initialUser?: User;
};

export const UserProvider = ({
  children,
  initialUser = null,
}: UserProviderProps) => {
  const [user, setUser] = useState<User>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
