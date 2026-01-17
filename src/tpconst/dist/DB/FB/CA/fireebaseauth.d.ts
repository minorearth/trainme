import { User } from "firebase/auth";
export declare const signInUserDB: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<void>;
export declare const launchAuthStateChangeMonitorDB: (action: (resolved: (value: string) => void, uid: string, emailVerified: boolean) => void) => Promise<string>;
export declare const createUserDB: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<User>;
export declare const resetPswDB: (email: string) => Promise<void>;
export declare const signOutUserDB: () => Promise<void>;
export declare const startUidMonitor: (setUserid: (id: string) => void, logout: () => void) => void;
//# sourceMappingURL=fireebaseauth.d.ts.map