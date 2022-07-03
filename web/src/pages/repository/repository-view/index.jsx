import "./index.css";
import React, { useEffect } from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import coverit from "../../../api/coverit";
import { useNavigate, useParams } from "react-router-dom";
import useCommonStyles from "../../../hooks/useCommonStyles";
import { RepositoryStatusTranslator } from "../../../translators";
import { format } from "date-fns";
import { RepositoryStatusEnum } from "../../../enums";

import ReactApexChart from "react-apexcharts";

const RepositoryView = () => {
  const [repository, setRepository] = React.useState(null);
  const [pullRequestsChart, setPullRequestsChart] = React.useState(null);
  const history = useNavigate();
  const commonStyles = useCommonStyles();
  const { id } = useParams();

  if (!id) {
    history("/home");
  }

  useEffect(() => {
    async function fetchData() {
      const response = await coverit.get(`/coverage/repository/${id}`);
      const repository = response.data?.repository;
      setRepository(repository);
      if (repository?.pull_requests) {
        buildPullRequestsChart(repository.pull_requests);
      }
    }
    fetchData();
  }, [id]);

  const getUpdatedDate = (dateString) => {
    if (dateString) {
      const dateObject = new Date(dateString);
      return format(dateObject, "dd/MM/yyyy HH:mm");
    }
    return "";
  };

  const openOnGitHub = () => {
    const path = `${repository.repository.owner}/${repository.repository.name}`;
    window.open(`https://github.com/${path}`);
  };

  const openOnCodeCov = () => {
    const path = `${repository.repository.owner}/${repository.repository.name}`;
    window.open(`https://codecov.io/github/${path}`);
  };

  const buildPullRequestsChart = (pullRequests) => {
    const seriesData = [
      {
        name: "BASE",
        data: pullRequests.map((pull) => `${pull?.coverage_base.toFixed(2)}%`),
      },
      {
        name: "HEAD",
        data: pullRequests.map((pull) => `${pull?.coverage_head.toFixed(2)}%`),
      },
    ];

    const getMinCoverage = (data) => {
      const minHead = Math.min(...data.map((item) => item.coverage_head));
      const minBase = Math.min(...data.map((item) => item.coverage_base));
      return Math.min(minHead, minBase);
    };

    const getMaxCoverage = (data) => {
      const maxHead = Math.max(...data.map((item) => item.coverage_head));
      const maxBase = Math.max(...data.map((item) => item.coverage_base));
      return Math.max(maxHead, maxBase);
    };

    setPullRequestsChart({
      series: seriesData,
      options: {
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        xaxis: {
          categories: pullRequests.map((pull) => pull.id),
          title: {
            text: "ID Pull Request",
            offsetY: -15
          },
          labels: {
            rotateAlways: true,
          },
        },
        yaxis: {
          title: {
            text: "% Cobertura",
          },
          min: getMinCoverage(pullRequests) - 2,
          max: getMaxCoverage(pullRequests) + 2,
          tickAmount: 2,
        },
        fill: {
          opacity: 1,
        },
        colors: ["#00e396", "#775dd0"],
      },
    });
  };

  return (
    <Box mx={2}>
      {repository ? (
        <Grid container spacing={2}>
          <Grid item xs={12} m={0}>
            <Paper>
              <Box mx={2} py={1}>
                <Stack direction="row">
                  <h2
                    pb={2}
                    style={{ marginRight: 10 }}
                  >{`${repository.repository.owner}/${repository.repository.name}`}</h2>
                  <Tooltip title="Abrir no GitHub">
                    <IconButton p={0} onClick={openOnGitHub}>
                      <Avatar
                        alt="GitHub"
                        src="/github.png"
                        sx={{ width: 20, height: 20 }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Abrir no CodeCov">
                    <IconButton p={0} onClick={openOnCodeCov}>
                      <Avatar
                        alt="Codecov"
                        src="/codecov.png"
                        sx={{ width: 20, height: 20 }}
                      />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={
              repository.repository.status === RepositoryStatusEnum.SUCCESS
                ? 7
                : 12
            }
          >
            <Paper>
              <Box mx={2} py={1}>
                <Grid container item xs={12}>
                  <h2 pb={2}>Detalhes</h2>
                </Grid>
                {repository.repository.status ===
                  RepositoryStatusEnum.SUCCESS && (
                  <Box>
                    <Grid item mb={2}>
                      <Typography
                        component="span"
                        className={commonStyles.bold}
                      >
                        Cobertura:{" "}
                      </Typography>
                      <Typography component="span">
                        {repository.repository.coverage.toFixed(2)}%
                      </Typography>
                    </Grid>
                  </Box>
                )}

                <Box>
                  <Grid item mb={2}>
                    <Typography
                      component="span"
                      mb={2}
                      className={commonStyles.bold}
                    >
                      Status:{" "}
                    </Typography>
                    <Typography component="span">
                      {RepositoryStatusTranslator[repository.repository.status]}
                    </Typography>
                  </Grid>
                  {repository.repository.status_info && (
                    <Grid item mb={2}>
                      <Typography
                        component="span"
                        mb={2}
                        className={commonStyles.bold}
                      >
                        Mensagem:{" "}
                      </Typography>
                      <Typography component="span">
                        {repository.repository.status_info}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item>
                    <Typography
                      component="span"
                      mb={2}
                      className={commonStyles.bold}
                    >
                      Última Atualização:{" "}
                    </Typography>
                    <Typography component="span">
                      {getUpdatedDate(repository.repository.updated)}
                    </Typography>
                  </Grid>
                </Box>
                <Box mb={2}></Box>
              </Box>
            </Paper>
          </Grid>

          {repository.repository.status === RepositoryStatusEnum.SUCCESS && (
            <Grid container item xs={12} sm={12} md={5} spacing={2}>
              <Grid item xs={12}>
                <Paper>
                  <Box mx={2} py={1}>
                    <Grid container item xs={12}>
                      <h2>{repository.language.language}</h2>
                    </Grid>
                    <Grid item>
                      <Typography
                        component="span"
                        mb={2}
                        className={commonStyles.bold}
                      >
                        Média global da linguagem:{" "}
                      </Typography>
                      <Typography component="span">
                        {repository.language.coverage.toFixed(2)}%
                      </Typography>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper>
                  <Box mx={2} py={1}>
                    <Grid container item xs={12}>
                      <h2>{repository.owner.owner}</h2>
                    </Grid>
                    <Grid item>
                      <Typography
                        component="span"
                        mb={2}
                        className={commonStyles.bold}
                      >
                        Média do proprietário:{" "}
                      </Typography>
                      <Typography component="span">
                        {repository.owner.coverage.toFixed(2)}%
                      </Typography>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
          {repository.pull_requests && !!repository.pull_requests.length && (
            <Grid item xs={12}>
              <Paper>
                <Box mx={2} py={1}>
                  <Grid container item xs={12}>
                    <h2>Pull Requests</h2>
                  </Grid>
                  <div id="chart">
                    <ReactApexChart
                      options={pullRequestsChart.options}
                      series={pullRequestsChart.series}
                      type="bar"
                      height={350}
                    />
                  </div>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box sx={{ display: "flex" }} className={commonStyles.fullscreenLoader}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
    </Box>
  );
};

export default RepositoryView;
