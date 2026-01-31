export declare const signInUser: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<void>;
export declare const launchAuthStateChangeMonitor: (action: (resolved: (value: string) => void, rejected: (value: string) => void, uid: string, emailVerified: boolean) => void) => Promise<string>;
export declare const createUser: ({ email, password, }: {
    email: string;
    password: string;
}) => Promise<import("firebase/auth").User>;
export declare const resetPsw: (email: string) => Promise<void>;
export declare const signOutUserRep: () => Promise<void>;
//# sourceMappingURL=repositoryFBAuth.d.ts.map