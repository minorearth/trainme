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
import { useStatTreeitem } from "./statVC";

const CustomStatItem = React.forwardRef(function CustomStatItem(
  { id, itemId, label, disabled, children },
  ref
) {
  const item = useTreeItemModel(itemId);

  const { showCode } = useStatTreeitem({
    itemId,
    code: item.code,
  });

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
          {/* {status.editing ? (
            <CustomLabelInput
              {...getLabelInputProps()}
              handleSaveItemLabel={copyGroupLink}
            />
          ) : ( */}
          <CustomLabel
            {...getLabelProps()}
            toggleItemEditing={interactions.toggleItemEditing}
            // isGroup={item.isFolder}
            showCode={showCode}
          />
          {/* )} */}
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
  showCode,
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
        {/* {isGroup && (
          <IconButton
            size="small"
            onClick={copyGroupLink}
            sx={{ color: "text.secondary" }}
          >
            <InsertLinkOutlinedIcon fontSize="small" />
          </IconButton>
        )} */}
        {/* {!isGroup && ( */}
        <IconButton
          size="small"
          onClick={showCode}
          sx={{ color: "text.secondary" }}
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
        {/* )} */}
      </Box>
    </TreeItemLabel>
  );
}

export default CustomStatItem;
