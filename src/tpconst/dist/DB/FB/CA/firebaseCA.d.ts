import { CollectionRead, CollectionWrite, CollectonsTypes, DBFormats, SubCollectionRead, SubCollectionWrite } from "../../../T";
export declare const setDocInCollection: <T extends DBFormats>({ collectionName, data, id, }: CollectionWrite<T>) => Promise<void>;
export declare const setDocInSubCollection: <T extends DBFormats>({ collectionName, id, subCollectionName, subId, data, }: SubCollectionWrite<T>) => Promise<void>;
export declare const updateDocByid: <T extends DBFormats>({ collectionName, id, data, }: CollectionWrite<Partial<T>>) => Promise<void>;
export declare const getDocDataFromCollectionById: <T extends DBFormats>({ collectionName, id, }: CollectionRead) => Promise<T>;
export declare const getDocDataFromSubCollectionById: <T extends DBFormats>({ collectionName, id, subCollectionName, subId, }: SubCollectionRead) => Promise<T>;
export declare const getDocFromCollectionByIdRealtime: <T extends DBFormats>({ collectionName, id, onChangeAction, }: {
    collectionName: CollectonsTypes;
    id: string;
    onChangeAction: (data: T) => void;
}) => Promise<import("@firebase/firestore").Unsubscribe>;
export declare const getMultipleDocs: <T extends DBFormats>({ collectionName, ids, }: {
    collectionName: CollectonsTypes;
    ids: string[];
}) => Promise<T[]>;
//# sourceMappingURL=firebaseCA.d.ts.map