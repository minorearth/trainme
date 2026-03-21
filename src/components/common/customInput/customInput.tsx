import { useRef, useState, useEffect, ChangeEvent } from "react";
import { Input, Box, IconButton } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import unit from "@/components/unitrun/layers/store/unit";

const CustomInput = observer(
  ({
    value,
    onchange,
  }: {
    value: string;
    onchange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  }) => {
    const [canScrollUp, setCanScrollUp] = useState(false);
    const [canScrollDown, setCanScrollDown] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;

      //   // Следим за изменением размеров (например, при печати текста)
      //   const resizeObserver = new ResizeObserver(() => checkScroll());
      //   resizeObserver.observe(el);

      // Следим за скроллом
      el.addEventListener("scroll", checkScroll);

      return () => {
        // resizeObserver.disconnect();
        el.removeEventListener("scroll", checkScroll);
      };
    }, []);

    const checkScroll = () => {
      const el = textareaRef.current;
      if (el) {
        console.log(el.scrollTop, el.scrollHeight, el.clientHeight);
        setCanScrollUp(el.scrollTop > 0);
        setCanScrollDown(el.scrollHeight - el.scrollTop > el.clientHeight + 40);
      }
    };

    const handleScrollClick = (direction: "up" | "down") => {
      const el = textareaRef.current;
      if (el) {
        const scrollAmount = 40;
        el.scrollBy({
          top: direction === "up" ? -scrollAmount : scrollAmount,
          behavior: "smooth",
        });
      }
    };

    return (
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <Input
          inputRef={textareaRef}
          multiline
          fullWidth
          disableUnderline
          rows={5}
          value={value}
          onChange={(e) => {
            onchange(e);
            checkScroll();
          }}
          onScroll={checkScroll}
          sx={{
            "&.MuiInputBase-root": {
              flexGrow: 1,
              display: "flex",
              minHeight: 0,
              minWidth: 0,
            },

            "& .MuiInputBase-input": {
              scrollbarWidth: "none", // Firefox
              "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
              overflowY: "auto",
              whiteSpace: "pre !important",
              overflowWrap: "normal !important",
              wordBreak: "keep-all !important",

              // 2. Включаем горизонтальный скролл (даже если он скрыт визуально)
              overflowX: "auto !important",

              // paddingRight: "40px",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 30,
            right: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            zIndex: 100,
            bottom: 0,
          }}
        >
          <IconButton
            size="small"
            disabled={!canScrollUp}
            onClick={() => handleScrollClick("up")}
            sx={{ backgroundColor: "#1878D4" }}
          >
            <KeyboardArrowUp fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            disabled={!canScrollDown}
            onClick={() => handleScrollClick("down")}
            sx={{ backgroundColor: "#1878D4" }}
          >
            <KeyboardArrowDown fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  },
);

export default CustomInput;

// import { Input } from "@mui/material";
// import { observer } from "mobx-react-lite";

// import unit from "@/components/unitrun/layers/store/unit";

// const CustomInput = observer(({ monacoid }: { monacoid: number }) => {
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   ) => {
//     unit.editors[monacoid].input = e.target.value;
//   };

//   return (
//     <Input
//       id="standard-multiline-flexible"
//       multiline
//       fullWidth
//       disableUnderline
//       rows={5}
//       onChange={(e) => handleChange(e)}
//       value={unit.editors[monacoid].input}
//       sx={{
//         display: "inline-block",
//         whiteSpace: "pre-wrap",
//         resize: "none",
//       }}
//     />
//   );
// });

// export default CustomInput;
