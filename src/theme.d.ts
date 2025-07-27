import { Theme as MuiTheme } from "@mui/material/styles";
import "styled-components";

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}

declare module "styled-components" {
  export interface DefaultTheme extends MuiTheme {}
}
