import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { treeItemClasses } from "@mui/x-tree-view/TreeItem";

import { data } from "./configtree";

const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.text.secondary,
  [`& .${treeItemClasses.content}`]: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    "&.Mui-expanded": {
      fontWeight: theme.typography.fontWeightRegular,
    },
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      color: "var(--tree-view-color)",
    },
    [`& .${treeItemClasses.label}`]: {
      fontWeight: "inherit",
      color: "inherit",
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 0,
    [`& .${treeItemClasses.content}`]: {
      paddingLeft: theme.spacing(2),
    },
  },
}));

const StyledTreeItem = React.forwardRef(function StyledTreeItem(props, ref) {
  const theme = useTheme();

  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    colorForDarkMode,
    bgColorForDarkMode,
    hasChildren,
    setPickedForTest,
    mode,
    actions,
    ...other
  } = props;

  const styleProps = {
    "--tree-view-color":
      theme.palette.mode !== "dark" ? color : colorForDarkMode,
    "--tree-view-bg-color":
      theme.palette.mode !== "dark" ? bgColor : bgColorForDarkMode,
    marginLeft: "15px",
  };

  return (
    <StyledTreeItemRoot
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
          {mode != "move" ? (
            <IconButton
              aria-label="Добавить в тест"
              onClick={(e) => actions.addTotest(e, props)}
            >
              <SendIcon />
            </IconButton>
          ) : (
            <IconButton
              aria-label="Переместить в папку"
              onClick={(e) => actions.moveTasks(props)}
            >
              <KeyboardDoubleArrowLeftOutlinedIcon />
            </IconButton>
          )}
        </Box>
      }
      style={styleProps}
      {...other}
      ref={ref}
    />
  );
});

export const Tree = ({ setSelected, sx, mode, actions }) => {
  const handleNodeSelection = (e, ids) => {
    setSelected([{ id: ids }]);
  };

  const renderTree = (nodes, mode, actions) => {
    const hasChildren = Array.isArray(nodes.children);
    return (
      <StyledTreeItem
        key={nodes.id}
        hasChildren={hasChildren}
        nodeId={nodes.id}
        labelText={nodes.name}
        labelIcon={FolderOutlinedIcon}
        actions={actions}
        mode={mode}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node, mode, actions))
          : null}
      </StyledTreeItem>
    );
  };

  return (
    <TreeView
      sx={sx}
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeSelect={(e, ids) => handleNodeSelection(e, ids)}
    >
      {renderTree(data, mode, actions)}
    </TreeView>
  );
};
