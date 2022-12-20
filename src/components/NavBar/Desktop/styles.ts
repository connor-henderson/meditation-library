import { Palette, SxProps, Theme } from "@mui/material";

const navbarContainer: SxProps<Theme> = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  pt: 0.5,
  pb: 0.5,
  color: "text.primary",
  marginLeft: 31
};

export const iconsStyle = (palette: Palette) => ({
  color: palette.mode === 'dark' ? palette.white.main : palette.dark.main,
});

export default navbarContainer;