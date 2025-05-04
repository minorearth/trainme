// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import * as React from "react";
import Box from "@mui/material/Box";
import { styled, alpha } from "@mui/material/styles";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { useState, useEffect, useRef } from "react";

import { IconButton, Button, TextField } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTreeItemUtils } from "@mui/x-tree-view/hooks";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import {
  setDocInCollectionClient,
  getDocDataFromCollectionByIdClient,
} from "@/db/domain/domain";

import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AdjustIcon from "@mui/icons-material/Adjust";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ExpandCircleDownOutlinedIcon from "@mui/icons-material/ExpandCircleDownOutlined";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HourglassBottomOutlinedIcon from "@mui/icons-material/HourglassBottomOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DrawOutlinedIcon from "@mui/icons-material/DrawOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckIcon from "@mui/icons-material/Check";
import { useTreeItem } from "@mui/x-tree-view/useTreeItem";
import {
  TreeItemContent,
  TreeItemRoot,
  TreeItemGroupTransition,
  TreeItemIconContainer,
  TreeItemLabel,
} from "@mui/x-tree-view/TreeItem";
import { TreeItemIcon } from "@mui/x-tree-view/TreeItemIcon";
import { TreeItemProvider } from "@mui/x-tree-view/TreeItemProvider";
import { TreeItemLabelInput } from "@mui/x-tree-view/TreeItemLabelInput";
import { v4 as uuidv4 } from "uuid";
import user from "@/store/user";
import { reaction } from "mobx";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks";

// import { MUI_X_PRODUCTS } from './products';

const MUI_X_PRODUCTS = [
  {
    id: "0",
    label: "Data Grid",
    isFolder: true,
    children: [
      { id: "grid-community", label: "@mui/x-data-grid" },
      { id: "grid-pro", label: "@mui/x-data-grid-pro" },
      { id: "grid-premium", label: "@mui/x-data-grid-premium" },
    ],
  },
  {
    id: "1",
    label: "Date and Time Pickers",
    isFolder: true,
    children: [
      { id: "pickers-community", label: "@mui/x-date-pickers" },
      { id: "pickers-pro", label: "@mui/x-date-pickers-pro" },
    ],
  },
  {
    id: "2",
    label: "Charts",
    isFolder: true,
    children: [{ id: "charts-community", label: "@mui/x-charts" }],
  },
  {
    id: "3",
    label: "Tree View",
    isFolder: true,
    children: [{ id: "tree-view-community", label: "@mui/x-tree-view" }],
  },
];

// const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
//   color: theme.palette.grey[200],
//   [`& .${treeItemClasses.content}`]: {
//     borderRadius: theme.spacing(0.5),
//     padding: theme.spacing(0.5, 1),
//     margin: theme.spacing(0.2, 0),
//     [`& .${treeItemClasses.label}`]: {
//       fontSize: "0.8rem",
//       fontWeight: 500,
//     },
//   },
//   [`& .${treeItemClasses.iconContainer}`]: {
//     borderRadius: "50%",
//     backgroundColor: theme.palette.primary.dark,
//     padding: theme.spacing(0, 1.2),
//     ...theme.applyStyles("light", {
//       backgroundColor: alpha(theme.palette.primary.main, 0.25),
//     }),
//     ...theme.applyStyles("dark", {
//       color: theme.palette.primary.contrastText,
//     }),
//   },
//   [`& .${treeItemClasses.groupTransition}`]: {
//     marginLeft: 15,
//     paddingLeft: 18,
//     borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
//   },
//   ...theme.applyStyles("light", {
//     color: theme.palette.grey[800],
//   }),
// }));

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  { id, itemId, label, disabled, children },
  ref
) {
  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getIconContainerProps,
    getLabelInputProps,
    status,
  } = useTreeItem({ id, itemId, label, disabled, children, rootRef: ref });

  const item = useTreeItemModel(itemId);
  // console.log();
  const { interactions } = useTreeItemUtils({
    itemId,
    children,
  });

  const handleContentDoubleClick = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputBlur = (event) => {
    event.defaultMuiPrevented = true;
  };

  const handleInputKeyDown = (event) => {
    event.defaultMuiPrevented = true;
  };

  const copyGroupLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_DOMAIN}/joingroup/${itemId}/${user.userid}`
    );
  };

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          {status.editing ? (
            <CustomLabelInput
              {...getLabelInputProps()}
              handleSaveItemLabel={copyGroupLink}
            />
          ) : (
            <CustomLabel
              {...getLabelProps()}
              copyGroupLink={copyGroupLink}
              toggleItemEditing={interactions.toggleItemEditing}
              isGroup={item.isFolder}
            />
          )}
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

function CustomLabel({
  editing,
  editable,
  children,
  toggleItemEditing,
  isGroup,
  handleSaveItemLabel,
  copyGroupLink,
  ...other
}) {
  return (
    <TreeItemLabel
      {...other}
      editable={editable}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        justifyContent: "space-between",
      }}
    >
      {children}
      <Box sx={{ display: "flex" }}>
        {editable && (
          <IconButton
            size="small"
            onClick={toggleItemEditing}
            sx={{ color: "text.secondary" }}
          >
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        {isGroup && (
          <IconButton
            size="small"
            onClick={copyGroupLink}
            sx={{ color: "text.secondary" }}
          >
            <InsertLinkOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </TreeItemLabel>
  );
}

function CustomLabelInput(props) {
  const { handleCancelItemLabelEditing, handleSaveItemLabel, value, ...other } =
    props;

  return (
    <React.Fragment>
      <TreeItemLabelInput {...other} value={value} />
      <IconButton
        color="error"
        size="small"
        onClick={() => {
          console.log("ada", value);
          // handleSaveItemLabel(event, value);
        }}
      >
        <CheckIcon fontSize="small" />
      </IconButton>
      <IconButton
        color="error"
        size="small"
        onClick={handleCancelItemLabelEditing}
      >
        <CloseRoundedIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
}

export default function Groups() {
  const [data, setData] = useState([]);
  const apiRef = useTreeViewApiRef();

  const [newGroupName, setNewGroupName] = useState("");
  const [editGroupId, setEditGroupId] = useState(null);
  const [editMemberId, setEditMemberId] = useState(null);
  let folders = useRef([]);

  const updateNodeLabel = (nodes, id, newLabel) => {
    return nodes.map((node) => {
      if (node.id === id) {
        return { ...node, label: newLabel };
      }
      if (node.children) {
        return {
          ...node,
          children: updateNodeLabel(node.children, id, newLabel),
        };
      }
      return node;
    });
  };

  const setLastEditedItem = ({ itemId, label }) => {
    const newdata = updateNodeLabel(data, itemId, label);
    setDocInCollectionClient("groups", arrToObject(newdata), user.userid);
  };

  reaction(
    () => user.userid, // Наблюдаемое значение
    (userid) => {
      if (userid != "") {
        const getGroups = async () => {
          const groups = await getDocDataFromCollectionByIdClient(
            "groups",
            user.userid
          );
          folders.current = Object.keys(groups.data);
          setData(objectToArr(groups.data));
        };
        getGroups();
      }
    }
  );

  const objectToArr = (data) => {
    const arr = Object.keys(data).map((id) => ({
      id,
      label: data[id].label,
      isFolder: data[id].isFolder,
      children: Object.keys(data[id].children).map((id2) => ({
        id: id2,
        label: data[id].children[id2].label,
        isFolder: data[id].children[id2].isFolder,
      })),
    }));
    return arr;
  };

  const arrToObject = (data) => {
    const obj = data.reduce(
      (acc, item) => ({
        ...acc,
        [item.id]: {
          label: item.label,
          isFolder: item.isFolder,

          children: item.children.reduce(
            (acc, child) => ({
              ...acc,
              [child.id]: { label: child.label, isFolder: child.isFolder },
            }),
            {}
          ),
        },
      }),
      {}
    );
    return obj;
  };

  const addNewGroup = () => {
    setData((prev) => {
      const data = [
        ...prev,
        {
          id: uuidv4(),
          label: "Новая группа",
          children: [],
          isFolder: true,
        },
      ];
      setDocInCollectionClient("groups", arrToObject(data), user.userid);
      return data;
    });
  };

  return (
    <Box sx={{ minHeight: 352, maxWidth: 450 }}>
      <Box sx={{ flexDirection: "row", display: "flex" }}>
        <IconButton
          size="small"
          onClick={addNewGroup}
          sx={{ color: "text.secondary" }}
        >
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
      <RichTreeView
        apiRef={apiRef}
        // defaultExpandedItems={["grid"]}
        slots={{ item: CustomTreeItem }}
        items={data}
        isItemEditable
        onItemLabelChange={(itemId, label) =>
          setLastEditedItem({ itemId, label })
        }
      />
    </Box>
  );
}

// import React, { useState } from "react";
// import { RichTreeView, TreeItem } from "@mui/lab";
// import { IconButton, Button, Box, TextField } from "@mui/material";
// import GroupIcon from "@mui/icons-material/Group";
// import PersonIcon from "@mui/icons-material/Person";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const initialData = {
//   groups: [
//     {
//       id: "1",
//       name: "Группа A",
//       members: [
//         { id: "1-1", name: "Иван Иванов" },
//         { id: "1-2", name: "Петр Петров" },
//       ],
//     },
//     {
//       id: "2",
//       name: "Группа B",
//       members: [{ id: "2-1", name: "Светлана Светлова" }],
//     },
//   ],
// };

// const MyRichTreeView = () => {
//   const [data, setData] = useState(initialData);
//   const [newGroupName, setNewGroupName] = useState("");
//   const [editGroupId, setEditGroupId] = useState(null);
//   const [editMemberId, setEditMemberId] = useState(null);

//   const handleAddGroup = () => {
//     if (newGroupName) {
//       const newGroup = {
//         id: Date.now().toString(),
//         name: newGroupName,
//         members: [],
//       };
//       setData((prev) => ({
//         ...prev,
//         groups: [...prev.groups, newGroup],
//       }));
//       setNewGroupName("");
//     }
//   };

//   const handleEditGroup = (id) => {
//     if (editGroupId === id) {
//       setEditGroupId(null);
//     } else {
//       setEditGroupId(id);
//     }
//   };

//   const handleSaveGroupEdit = (id, newName) => {
//     setData((prev) => ({
//       ...prev,
//       groups: prev.groups.map((g) =>
//         g.id === id ? { ...g, name: newName } : g
//       ),
//     }));
//     setEditGroupId(null);
//   };

//   const handleDeleteGroup = (id) => {
//     setData((prev) => ({
//       ...prev,
//       groups: prev.groups.filter((g) => g.id !== id),
//     }));
//   };

//   const handleAddMember = (groupId) => {
//     const memberName = prompt("Введите имя человека");
//     if (memberName) {
//       const newMember = { id: Date.now().toString(), name: memberName };
//       setData((prev) => ({
//         ...prev,
//         groups: prev.groups.map((g) =>
//           g.id === groupId ? { ...g, members: [...g.members, newMember] } : g
//         ),
//       }));
//     }
//   };

//   const handleEditMember = (groupId, memberId) => {
//     if (editMemberId === memberId) {
//       setEditMemberId(null);
//     } else {
//       setEditMemberId(memberId);
//     }
//   };

//   const handleSaveMemberEdit = (groupId, memberId, newName) => {
//     setData((prev) => ({
//       ...prev,
//       groups: prev.groups.map((g) =>
//         g.id === groupId
//           ? {
//               ...g,
//               members: g.members.map((m) =>
//                 m.id === memberId ? { ...m, name: newName } : m
//               ),
//             }
//           : g
//       ),
//     }));
//     setEditMemberId(null);
//   };

//   const handleDeleteMember = (groupId, memberId) => {
//     setData((prev) => ({
//       ...prev,
//       groups: prev.groups.map((g) =>
//         g.id === groupId
//           ? { ...g, members: g.members.filter((m) => m.id !== memberId) }
//           : g
//       ),
//     }));
//   };

//   return (
//     <Box>
//       <TextField
//         label="Название группы"
//         value={newGroupName}
//         onChange={(e) => setNewGroupName(e.target.value)}
//         variant="outlined"
//         size="small"
//         style={{ marginBottom: "16px" }}
//       />

//       <Button variant="contained" onClick={handleAddGroup}>
//         Добавить группу
//       </Button>

//       <RichTreeView>
//         {data.groups.map((group) => (
//           <TreeItem
//             key={group.id}
//             nodeId={group.id}
//             label={
//               <Box display="flex" alignItems="center">
//                 <GroupIcon style={{ marginRight: "8px" }} />
//                 {editGroupId === group.id ? (
//                   <EditableLabel
//                     initialValue={group.name}
//                     onSave={(newValue) =>
//                       handleSaveGroupEdit(group.id, newValue)
//                     }
//                   />
//                 ) : (
//                   <>
//                     {group.name}
//                     <IconButton onClick={() => handleEditGroup(group.id)}>
//                       <EditIcon />
//                     </IconButton>
//                     <IconButton onClick={() => handleDeleteGroup(group.id)}>
//                       <DeleteIcon />
//                     </IconButton>
//                   </>
//                 )}
//               </Box>
//             }
//           >
//             {group.members.map((member) => (
//               <TreeItem
//                 key={member.id}
//                 nodeId={member.id}
//                 label={
//                   <Box display="flex" alignItems="center">
//                     <PersonIcon style={{ marginRight: "8px" }} />
//                     {editMemberId === member.id ? (
//                       <EditableLabel
//                         initialValue={member.name}
//                         onSave={(newValue) =>
//                           handleSaveMemberEdit(group.id, member.id, newValue)
//                         }
//                       />
//                     ) : (
//                       <>
//                         {member.name}
//                         <IconButton
//                           onClick={() => handleEditMember(group.id, member.id)}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton
//                           onClick={() =>
//                             handleDeleteMember(group.id, member.id)
//                           }
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </>
//                     )}
//                   </Box>
//                 }
//               />
//             ))}
//             {/* Кнопка для добавления нового члена группы */}
//             <Button
//               variant="outlined"
//               size="small"
//               onClick={() => handleAddMember(group.id)}
//             >
//               Добавить человека
//             </Button>
//           </TreeItem>
//         ))}
//       </RichTreeView>
//     </Box>
//   );
// };

// // Компонент для редактирования метки
// const EditableLabel = ({ initialValue, onSave }) => {
//   const [value, setValue] = useState(initialValue);

//   return (
//     <>
//       <TextField
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         size="small"
//         onBlur={() => onSave(value)} // Сохраняем при потере фокуса
//         autoFocus // Автофокус на поле ввода при редактировании
//       />
//     </>
//   );
// };

// export default MyRichTreeView;
