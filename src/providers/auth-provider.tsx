// src/context/user-context.tsx
"use client";

import {
    createContext,
    useContext,
    type ReactNode,
} from "react";

export type UserType = {
    seq: number;
    name: string;
    email: string;
    roleSeq: number;
};

const UserContext = createContext<UserType | null>(null);

export function AuthProvider({user, children,}: { user: UserType | null; children: ReactNode; }) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}