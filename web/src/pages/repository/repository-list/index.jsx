import "./index.css";
import React, { useEffect } from "react";
import {
  alpha,
  Box,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import coverit from "../../../api/coverit";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";

import clsx from "clsx";
import useCommonStyles from "../../../hooks/useCommonStyles";
import { RepositoryStatusTranslator } from "../../../translators";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const RepositoryList = () => {
  const [repositories, setRepositories] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const history = useNavigate();
  const commonStyles = useCommonStyles();

  useEffect(() => {
    async function fetchData() {
      const response = await coverit.get("/repository/");
      setRepositories(response.data?.repositories || []);
      setRows(response.data?.repositories || []);
    }
    fetchData();
  }, []);

  function onChangeSearch(event) {
    const value = event?.target.value ? event.target.value.toLowerCase() : "";
    const filtered = repositories.filter((repo) => {
      return repo.name.includes(value) || repo.owner.includes(value);
    });
    setRows(filtered);
  }

  return (
    <Box mt={2}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Buscar..."
          inputProps={{ "aria-label": "search" }}
          onChange={onChangeSearch}
        />
      </Search>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Proprietário/Nome</TableCell>
              <TableCell>Cobertura</TableCell>
              <TableCell>Licença</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => history(`/repositories/${row.id}`)}
              >
                <TableCell component="th" scope="row">
                  {`${row.owner}/${row.name}`}
                </TableCell>
                <TableCell>
                  {row.coverage ? `${row.coverage.toFixed(2)}%` : "-"}
                </TableCell>
                <TableCell>{row.license ? row.license : "-"}</TableCell>
                <TableCell
                  className={clsx(
                    row.status === "success" && commonStyles.colorTextCompleted,
                    row.status === "error" && commonStyles.colorTextError
                  )}
                >
                  {RepositoryStatusTranslator[row.status]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RepositoryList;
