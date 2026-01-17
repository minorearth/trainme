import admin from "firebase-admin";
export declare function createFirebaseAdminApp(params: initAdmin): Promise<typeof admin.app | undefined>;
interface initAdmin {
    projectId: string;
    clientEmail: string;
    storageBucket: string;
    privateKey: string;
}
export declare function initAdmin(): Promise<admin.firestore.Firestore>;
export {};
//# sourceMappingURL=firebaseappAdmin.d.ts.map