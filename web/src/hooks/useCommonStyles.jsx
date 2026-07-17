const commonStyles = {
  colorTextCompleted: {
    color: "success.main",
  },
  colorTextInprocess: {
    color: "warning.main",
  },
  colorTextNew: {
    color: "warning.main",
  },
  colorTextError: {
    color: "error.main",
  },
  chipHigh: {
    backgroundColor: "error.main",
    color: "#fff",
  },
  chipMedium: {
    backgroundColor: "info.main",
    color: "#fff",
  },
  chipLow: {
    backgroundColor: "warning.main",
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
};

const useCommonStyles = () => commonStyles;

export default useCommonStyles;
