import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";

interface BorderedOutputProps {
  label: string;
  children: React.ReactNode;
  sx?: SxProps<Theme>; // Позволяет прокидывать дополнительные стили снаружи
}

const BorderedOutput: React.FC<BorderedOutputProps> = ({
  label,
  children,
  sx,
}) => {
  return (
    <Box
      component="fieldset"
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1.5,
        m: 0,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        flexGrow: 1,

        transition: "border-color 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main", // Подсвечиваем рамку при наведении
        },
        ...sx, // Стили извне перекроют дефолтные, если нужно
      }}
    >
      <Typography
        component="legend"
        variant="caption"
        sx={{
          px: 0.8,
          color: "text.secondary",
          fontWeight: 600,
          lineHeight: "1",
          userSelect: "none", // Чтобы заголовок не выделялся курсором
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          flexGrow: 1,
          // Стили скроллбара для лучшего вида в MUI
          "&::-webkit-scrollbar": { height: "6px" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "action.hover",
            borderRadius: "10px",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default BorderedOutput;
