import { CollectionRead, CollectonsTypes, DBFormats } from "../../../T";
export declare const updateDocSA: <T>({ collectionName, datanotencrypted, }: {
    collectionName: CollectonsTypes;
    datanotencrypted: {
        id: string;
        data: T;
    };
}) => Promise<void>;
export declare const getDocSA: <T extends DBFormats>({ collectionName, id, }: CollectionRead) => Promise<T>;
export declare const checkCoursePaidSA: (courseid: string, uid: string) => Promise<boolean>;
export declare const checkCoursePaidSA2: (courseid: string, uid: string) => Promise<boolean>;
//# sourceMappingURL=firebaseSA.d.ts.map