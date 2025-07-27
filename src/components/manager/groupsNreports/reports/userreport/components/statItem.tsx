import Box from "@mui/material/Box";
import * as React from "react";

import { IconButton } from "@mui/material";
import { useTreeItemUtils } from "@mui/x-tree-view/hooks";
import { useTreeItemModel } from "@mui/x-tree-view/hooks";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
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
import stat from "@/components/manager/groupsNreports/store/stat";
import { UserReport } from "@/T/Managertypes";
import { TT } from "@/T/const";

const CustomStatItem = React.forwardRef(function CustomStatItem(
  props: UseTreeItemParameters,
  ref: React.Ref<HTMLLIElement>
) {
  const { itemId, children } = props;

  const item = useTreeItemModel<UserReport>(itemId);

  const {
    getContextProviderProps,
    getRootProps,
    getContentProps,
    getLabelProps,
    getGroupTransitionProps,
    getIconContainerProps,
    status,
  } = useTreeItem({ ...props, rootRef: ref });

  // const { interactions } = useTreeItemUtils({
  //   itemId,
  //   children,
  // });

  return (
    <TreeItemProvider {...getContextProviderProps()}>
      <TreeItemRoot {...getRootProps()}>
        <TreeItemContent {...getContentProps()}>
          <TreeItemIconContainer {...getIconContainerProps()}>
            <TreeItemIcon status={status} />
          </TreeItemIconContainer>
          <CustomLabel
            {...getLabelProps()}
            // toggleItemEditing={interactions.toggleItemEditing}
            showCode={() => stat.showCode(item?.code || "some error")}
            type={item?.type || "some error"}
          />
        </TreeItemContent>
        {children && <TreeItemGroupTransition {...getGroupTransitionProps()} />}
      </TreeItemRoot>
    </TreeItemProvider>
  );
});

function CustomLabel({
  editable,
  children,
  showCode,
  type,
  ...other
}: {
  editable: boolean;
  children: React.ReactNode;
  showCode: () => void;
  type: string;
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
        {type == TT.task && (
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
