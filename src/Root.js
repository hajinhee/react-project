import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import App from "./App";

function Root() {
  // Create a theme instance.
  const theme = createTheme({
    typography: {
      fontFamily: ["GmarketSansMedium"],
    },

    palette: {
      primary: {
        main: "#FF4D4D",
        light: "#FF7070",
        dark: "#B23535",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#F7CFD8",
        light: "#F8D8DF",
        dark: "#AC9097",
        contrastText: "#000000",
      },
    },
  });

  // useEffect(() => {
  //   const r = document.querySelector(":root");

  //   muiThemePaletteKeys.forEach((paletteKey) => {
  //     const themeColorObj = theme.palette[paletteKey];

  //     for (const key in themeColorObj) {
  //       if (Object.hasOwnProperty.call(themeColorObj, key)) {
  //         const colorVal = themeColorObj[key];
  //         r.style.setProperty(`--mui-color-${paletteKey}-${key}`, colorVal);
  //       }
  //     }
  //   });
  // }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </>
  );
}

export default Root;
