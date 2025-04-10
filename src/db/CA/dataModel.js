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
} from "firebase/firestore";

export const updateDocFieldsInCollectionById = async (
  db,
  collectionName,
  id,
  data
) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const getDocsKeyValue = async (db, collectionName, key, value) => {
  const q = query(collection(db, collectionName), where(key, "==", value));
  const docs = await getDocs(q);
  return docs;
};

export const setDocInCollection = async (db, collectionName, data, id) => {
  await setDoc(doc(db, collectionName, id), data);
};

export const updateUsersInChamp = async (db, collectionName, data, id) => {
  const ref = doc(db, collectionName, id);
  try {
    const feed = await updateDoc(ref, {
      [`users.${data.id}`]: {
        id: data.id,
        name: data.name,
        pts: 0,
        change: 0,
        persstatus: data.persstatus,
        avatarid: data.avatarid,
      },
    });
  } catch (e) {
    return "error";
  }
};

export const updatePoinsInChamp = async (db, collectionName, data, id) => {
  const ref = doc(db, collectionName, id);

  const feed = await updateDoc(ref, {
    [`users.${data.id}.pts`]: increment(data.pts),
  });
};

export const setTaskLogInChamp = async (db, collectionName, data, id) => {
  // const docSnap = await getDoc(doc(db, collectionName, id));

  const ref = doc(db, collectionName, id);

  const feed = await updateDoc(ref, {
    [`users.${data.id}.tasklog`]: data.tasklog,
    [`users.${data.id}.persstatus`]: "champisover",
  });
};

export const updateChampStatus = async (db, collectionName, status, id) => {
  // const docSnap = await getDoc(doc(db, collectionName, id));
  const ref = doc(db, collectionName, id);

  const feed = await updateDoc(ref, {
    status,
  });
};

export const getDocDataFromCollectionById = async (db, collectionName, id) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  const data = docSnap.data();
  return { id: docSnap.id, data };
  // return JSON.stringify({ id: docSnap.id, ...data });
};

export const getDocFromCollectionById = async (db, collectionName, id) => {
  const docSnap = await getDoc(doc(db, collectionName, id));
  const data = docSnap.data();
  return { id: docSnap.id, ...data };
  // return JSON.stringify({ id: docSnap.id, ...data });
};

export const getDocFromCollectionByIdRealtime = async (
  db,
  collectionName,
  id,
  refreshdata
) => {
  const docRef = doc(db, collectionName, id);
  const unsubscribe = onSnapshot(docRef, (doc) => {
    refreshdata(doc.data());
  });
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return { data: { id: docSnap.id, ...data }, unsubscribe };
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

// const DBDocsToObject = (docs) => {
//   let ret = [];
//   docs.forEach((item) => {
//     {
//       const data = item.data();
//       ret = [...ret, { id: item.id, ...data }];
//     }
//   });
//   return ret;
// };

// export const updateDocFieldsInCollectionById2 = async (path, data) => {
//   await updateDoc(doc(db, path), data);
// };

// export const log = async (data) => {
//   await updateDoc(doc(db, "logs", "1"), data);
// };

// const DBDocsToIds = (docs) => {
//   return docs.docs.map((item) => item.id);
// };

// const DBDocsToIdExt = (docs) => {
//   let ret = [];
//   docs.forEach((item) => {
//     {
//       const data = item.data();
//       ret = [...ret, { id: item.id, extid: data.extid }];
//     }
//   });
//   return ret;
// };

// export const getMultipleDocsFromCollection = async (collectionName, ids) => {
//   const col = collection(db, collectionName);
//   const q = query(col, where(documentId(), "in", ids));
//   return DBDocsToObject(await getDocs(q));
// };

// const getDocsExtFiltered = async (collectionName, dependentFilter) => {
//   if (dependentFilter.length == 0) {
//     return [];
//   }
//   const col = collection(db, collectionName);
//   let q;
//   if (dependentFilter != "none") {
//     const ids = dependentFilter.map((item) => item.id);
//     q = query(col, where("extid", "in", ids));
//   } else {
//     q = query(col);
//   }
//   return await getDocs(q);
// };

// export const getDocsDataExtFiltered = async (
//   collectionName,
//   dependentFilter
// ) => {
//   const docs = await getDocsExtFiltered(collectionName, dependentFilter);
//   return DBDocsToObject(docs);
// };

// export const getDocsIdExtFiltered = async (collectionName, dependentFilter) => {
//   const docs = await getDocsExtFiltered(collectionName, dependentFilter);
//   return DBDocsToIdExt(docs);
// };

// export const deleteAllDocsInCollection = async (collectionName) => {
//   const citySnapshot = await getDocs(collection(db, collectionName));
//   citySnapshot.forEach((item) => {
//     deleteDoc(doc(db, collectionName, item.id));
//   });
// };

// export const deleteAllDocsInCollectionByIds = async (collectionName, ids) => {
//   const batch = writeBatch(db);
//   ids.forEach((item) => {
//     batch.delete(doc(db, collectionName, item));
//   });
//   await batch.commit();
// };

// const checkIfExistByFieldValue = async (collectionName, key, value) => {
//   const q = query(collection(db, collectionName), where(key, "==", value));
//   const querySnapshot = await getDocs(q);
//   return querySnapshot.docs.length == 0;
// };

// export const addMultipledDocsInCollectionByValue = async (
//   collectionName,
//   keyField,
//   data,
//   checkduplic,
//   extid
// ) => {
//   const collectionRef = collection(db, collectionName);
//   const zu = data.map((item) => {
//     if (checkduplic == true) {
//       const checkFields =
//         extid == false
//           ? {
//               [keyField]: item[keyField],
//             }
//           : {
//               [keyField]: item[keyField],
//               extid: item["extid"],
//             };
//       return checkIfUniqueExistAndReturnDoc(collectionName, checkFields).then(
//         (res) => {
//           if (res == "none") {
//             addDoc(collectionRef, item);
//           }
//         }
//       );
//     } else {
//       return addDoc(collectionRef, item);
//     }
//   });
//   await Promise.allSettled(zu);
// };

// export const addDocInCollectionByValue = async (
//   collectionName,
//   key,
//   value,
//   data,
//   checkduplic
// ) => {
//   const collectionRef = collection(db, collectionName);
//   const check =
//     checkduplic == true
//       ? await checkIfExistByFieldValue(collectionName, key, value)
//       : true;
//   check && (await addDoc(collectionRef, data));
// };

// export const copyDocInCollection = async (collectionName, ids) => {
//   const zu = ids.map((item) => {
//     return getDoc(doc(db, collectionName, item)).then((res) => {
//       const data = res.data();
//       return addDoc(collection(db, collectionName), data);
//     });
//   });

//   await Promise.allSettled(zu);
// };

// export const updateMultipleDocInCollectionById = async (
//   collectionName,
//   ids,
//   data
// ) => {
//   ids.forEach((item) => {
//     updateDoc(doc(db, collectionName, item.id), data);
//   });
// };

// export const FullUpdateDocInCollectionById = async (
//   collectionName,
//   id,
//   data
// ) => {
//   setDoc(doc(db, collectionName, id), data);
// };

// export const checkIfUniqueExistAndReturnDoc = async (
//   collectionName,
//   request
// ) => {
//   return await checkIfUniqueExistAndReturnDocDM(collectionName, request);
// };
