import { makeStyles } from "@mui/styles";

const useCommonStyles = makeStyles((theme) => ({
  colorTextCompleted: {
    color: theme.palette.success.main,
  },
  colorTextInprocess: {
    color: theme.palette.warning.main,
  },
  colorTextNew: {
    color: theme.palette.warning.main,
  },
  colorTextError: {
    color: theme.palette.error.main,
  },
  chipHigh: {
    backgroundColor: theme.palette.error.main,
    color: "#fff",
  },
  chipMedium: {
    backgroundColor: theme.palette.info.main,
    color: "#fff",
  },
  chipLow: {
    backgroundColor: theme.palette.warning.main,
    color: "#fff",
  },
  textCapitalize: {
    textTransform: "capitalize",
  },
  bold: {
    fontWeight: 600,
  },
  fullscreenLoader: {
    marginTop: -60,
    marginLeft: -20,
    display: "flex",
    height: "100vh",
    width: "100vw",
  },
}));

export default useCommonStyles;
