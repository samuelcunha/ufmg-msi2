import React from "react";
import {
  alpha,
  Box,
  Chip,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { getServerClient } from "../../src/api/coverit";
import { useRouter } from "next/router";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";

import useCommonStyles from "../../src/hooks/useCommonStyles";
import { RepositoryStatusTranslator } from "../../src/translators";

const STATUS_OPTIONS = ["success", "pending", "error"];
const SORT_OPTIONS = [
  { value: "", label: "Padrão" },
  { value: "coverage_desc", label: "Cobertura (maior primeiro)" },
  { value: "coverage_asc", label: "Cobertura (menor primeiro)" },
];

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

const DEFAULT_PAGE_SIZE = 20;

export async function getServerSideProps({ query }) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const pageSize = Math.min(
    Math.max(parseInt(query.page_size, 10) || DEFAULT_PAGE_SIZE, 1),
    100
  );
  const search = typeof query.search === "string" ? query.search : "";
  const language = typeof query.language === "string" ? query.language : "";
  const owner = typeof query.owner === "string" ? query.owner : "";
  const status = typeof query.status === "string" ? query.status : "";
  const sort = typeof query.sort === "string" ? query.sort : "";

  const client = getServerClient();
  const [repositoriesRes, languagesRes] = await Promise.all([
    client.get("/repository/", {
      params: {
        page,
        page_size: pageSize,
        search: search || undefined,
        language: language || undefined,
        owner: owner || undefined,
        status: status || undefined,
        sort: sort || undefined,
      },
    }),
    client.get("/repository/languages"),
  ]);

  return {
    props: {
      repositories: repositoriesRes.data?.repositories || [],
      total: repositoriesRes.data?.total || 0,
      languages: languagesRes.data?.languages || [],
      page,
      pageSize,
      search,
      language,
      owner,
      status,
      sort,
    },
  };
}

const RepositoryList = ({
  repositories,
  total,
  languages,
  page,
  pageSize,
  search,
  language,
  owner,
  status,
  sort,
}) => {
  const router = useRouter();
  const commonStyles = useCommonStyles();
  const [searchInput, setSearchInput] = React.useState(search);
  const searchDebounce = React.useRef(null);

  React.useEffect(() => {
    setSearchInput(search);
  }, [search]);

  function pushQuery(nextQuery) {
    router.push({
      pathname: "/repositories",
      query: {
        ...router.query,
        ...nextQuery,
      },
    });
  }

  function onChangeSearch(event) {
    const value = event.target.value;
    setSearchInput(value);
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      pushQuery({ search: value || undefined, page: 1 });
    }, 400);
  }

  function onChangePage(_event, newPage) {
    pushQuery({ page: newPage + 1 });
  }

  function onChangeRowsPerPage(event) {
    pushQuery({ page_size: parseInt(event.target.value, 10), page: 1 });
  }

  function onChangeLanguage(event) {
    pushQuery({ language: event.target.value || undefined, page: 1 });
  }

  function onChangeStatus(event) {
    pushQuery({ status: event.target.value || undefined, page: 1 });
  }

  function onChangeSort(event) {
    pushQuery({ sort: event.target.value || undefined, page: 1 });
  }

  function clearOwner() {
    pushQuery({ owner: undefined, page: 1 });
  }

  return (
    <Box mt={2}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 2 }}
      >
        <Search sx={{ flexGrow: 1, maxWidth: 320 }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Buscar..."
            inputProps={{ "aria-label": "search" }}
            value={searchInput}
            onChange={onChangeSearch}
          />
        </Search>
        <Select
          size="small"
          displayEmpty
          value={language}
          onChange={onChangeLanguage}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todas as linguagens</MenuItem>
          {languages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          displayEmpty
          value={status}
          onChange={onChangeStatus}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Todos os status</MenuItem>
          {STATUS_OPTIONS.map((value) => (
            <MenuItem key={value} value={value}>
              {RepositoryStatusTranslator[value]}
            </MenuItem>
          ))}
        </Select>
        <Select
          size="small"
          displayEmpty
          value={sort}
          onChange={onChangeSort}
          sx={{ minWidth: 220 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {owner && (
          <Chip label={`Proprietário: ${owner}`} onDelete={clearOwner} />
        )}
      </Stack>
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
            {repositories.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => router.push(`/repositories/${row.id}`)}
              >
                <TableCell component="th" scope="row">
                  {`${row.owner}/${row.name}`}
                </TableCell>
                <TableCell>
                  {row.coverage ? `${row.coverage.toFixed(2)}%` : "-"}
                </TableCell>
                <TableCell>{row.license ? row.license : "-"}</TableCell>
                <TableCell
                  sx={
                    row.status === "success"
                      ? commonStyles.colorTextCompleted
                      : row.status === "error"
                      ? commonStyles.colorTextError
                      : undefined
                  }
                >
                  {RepositoryStatusTranslator[row.status]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={onChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={onChangeRowsPerPage}
          rowsPerPageOptions={[10, 20, 50, 100]}
          labelRowsPerPage="Linhas por página"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} de ${count}`
          }
        />
      </TableContainer>
    </Box>
  );
};

export default RepositoryList;
