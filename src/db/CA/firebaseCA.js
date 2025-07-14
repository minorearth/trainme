import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  increment,
  documentId,
} from "firebase/firestore";

export const setDocInCollection = async (db, collectionName, data, id) => {
  await setDoc(doc(db, collectionName, id), data);
};

export const setDocInSubCollection = async (
  db,
  collectionName1,
  id1,
  collectionName2,
  id2,
  data
) => {
  await setDoc(doc(db, collectionName1, id1, collectionName2, id2), data);
};

export const updateDocByid = async (db, collectionName, id, data) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const getDocDataFromCollectionById = async (db, collectionName, id) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  return { id: docSnap.id, data: docSnap.data() };
};

export const getDocDataFromSubCollectionById = async (
  db,
  collectionName1,
  id1,
  collectionName2,
  id2
) => {
  const docSnap = await getDoc(
    doc(db, collectionName1, id1, collectionName2, id2)
  );
  return { id: docSnap.id, data: docSnap.data() };
};

export const getDocFromCollectionById = async (db, collectionName, id) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  const data = docSnap.data();
  return { id: docSnap.id, ...data };
};

export const getDocFromCollectionByIdRealtime = async (
  db,
  collectionName,
  id,
  onChangeAction
) => {
  const unsubscribe = onSnapshot(doc(db, collectionName, id), (doc) => {
    onChangeAction(doc.data());
  });
  return unsubscribe;
};

export const addDocInCollection = async (db, collectionName, data) => {
  const doc = await addDoc(collection(db, collectionName), data);
  return doc.id;
};

export const getAllDocs = async (db, collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot;
};

export const deleteDocFromCollection = async (db, collectionName, id) => {
  deleteDoc(doc(db, collectionName, id));
};

export const copyDoc = async (db, collection, oldindex, newindex) => {
  const res = await getDoc(doc(db, collection, oldindex));
  const data = res.data();
  setDoc(doc(db, collection, newindex), data);
};

export const getMultipleDocs = async (db, collectionName, ids) => {
  const col = collection(db, collectionName);
  const q = query(col, where(documentId(), "in", ids));
  return multipleDocsToArray(await getDocs(q));
};

const multipleDocsToArray = (docs) => {
  let ret = [];
  docs.forEach((doc) => {
    {
      const data = doc.data();
      ret = [...ret, { id: doc.id, ...data }];
    }
  });
  return ret;
};
