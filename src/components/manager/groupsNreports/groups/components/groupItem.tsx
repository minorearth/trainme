// https://mui.com/x/react-tree-view/tree-item-customization/
// https://mui.com/x/react-tree-view/rich-tree-view/editing/

import Box from "@mui/material/Box";
import * as React from "react";

import { IconButton } from "@mui/material";
import { useTreeItemUtils } from "@mui/x-tree-view/hooks";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";
import { useTheme } from "@mui/material/styles";

import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckIcon from "@mui/icons-material/Check";
import PivotTableChartOutlinedIcon from "@mui/icons-material/PivotTableChartOutlined";
import {
  useTreeItem,
  UseTreeItemParameters,
} from "@mui/x-tree-view/useTreeItem";
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
import stat from "@/components/manager/groupsNreports/store/stat";
import { GroupArr } from "@/T/typesDB";

const CustomTreeItem = React.forwardRef(function CustomTreeItem(
  props: UseTreeItemParameters,
  ref: React.Ref<HTMLLIElement>
) {
  const { id, itemId, label, disabled, children } = props;
  const item = useTreeItemModel<GroupArr>(itemId);

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

  const { interactions } = useTreeItemUtils({
    itemId,
    children,
  });

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
              handleCancelItemLabelEditing={() => {}}
            />
          ) : (
            <CustomLabel
              {...getLabelProps()}
              hasChildren={React.Children.count(children) > 0}
              // hasChildren={children && children.length != 0}

              copyGroupLink={() => stat.actions.copyGroupLink(itemId)}
              toggleItemEditing={interactions.toggleItemEditing}
              isGroup={item?.isFolder || false}
              showUserMeta={() => stat.actions.showUserReport(item?.uid || "")}
              showReport={() => {
                stat.setGroupSelected(itemId);
                stat.actions.showReport(itemId);
              }}
            />
          )}
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

function CustomLabel({
  editable,
  children,
  toggleItemEditing,
  isGroup,
  copyGroupLink,
  showUserMeta,
  showReport,
  hasChildren,
  ...other
}: {
  editable: boolean;
  children: React.ReactNode;
  toggleItemEditing: () => void;
  isGroup: boolean;
  copyGroupLink: () => void;
  showUserMeta: () => void;
  showReport: () => void;
  hasChildren: boolean;
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
        {isGroup && hasChildren && (
          <IconButton
            size="small"
            onClick={showReport}
            sx={{ color: "text.secondary" }}
          >
            <PivotTableChartOutlinedIcon fontSize="small" />
          </IconButton>
        )}
        {!isGroup && (
          <IconButton
            size="small"
            onClick={showUserMeta}
            sx={{ color: "text.secondary" }}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </TreeItemLabel>
  );
}

function CustomLabelInput({
  handleCancelItemLabelEditing,
  value,
  ...other
}: {
  handleCancelItemLabelEditing: () => void;
  value: string;
}) {
  const theme = useTheme();

  return (
    <React.Fragment>
      <TreeItemLabelInput
        {...other}
        value={value}
        sx={{ color: theme.palette.text.primary }}
      />
      <IconButton color="error" size="small" onClick={() => {}}>
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

export default CustomTreeItem;

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
