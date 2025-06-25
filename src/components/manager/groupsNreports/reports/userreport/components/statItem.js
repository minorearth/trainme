import Box from "@mui/material/Box";
import * as React from "react";

import { IconButton } from "@mui/material";
import { useTreeItemUtils } from "@mui/x-tree-view/hooks";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
import stat from "@/components/manager/groupsNreports/store/stat";
const CustomStatItem = React.forwardRef(function CustomStatItem(
  { id, itemId, label, disabled, children },
  ref
) {
  const item = useTreeItemModel(itemId);

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getIconContainerProps,
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
          <CustomLabel
            {...getLabelProps()}
            toggleItemEditing={interactions.toggleItemEditing}
            // isGroup={item.isFolder}
            showCode={() => stat.actions.showCode(item.code)}
            type={item.type}
          />
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
  showCode,
  type,
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
        {type == "task" && (
          <IconButton
            size="small"
            onClick={showCode}
            sx={{ color: "text.secondary" }}
          >
            <VisibilityOutlinedIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </TreeItemLabel>
  );
}

export default CustomStatItem;
