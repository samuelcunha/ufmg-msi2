import React from "react";
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { getServerClient } from "../../src/api/coverit";
import useCommonStyles from "../../src/hooks/useCommonStyles";
import { RepositoryStatusTranslator } from "../../src/translators";
import { format } from "date-fns";
import { RepositoryStatusEnum } from "../../src/enums";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTitle = ({ title, description }) => (
  <Grid
    container
    item
    xs={12}
    alignItems="center"
    style={{ width: "fit-content" }}
  >
    <h2 style={{ marginRight: 4 }}>{title}</h2>
    <Tooltip title={description}>
      <IconButton size="small">
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Grid>
);

export async function getServerSideProps({ params }) {
  const client = getServerClient();
  try {
    const response = await client.get(`/coverage/repository/${params.id}`);
    const repository = response.data?.repository;
    if (!repository) {
      return { notFound: true };
    }
    return { props: { repository } };
  } catch (error) {
    if (error.response?.status === 404) {
      return { notFound: true };
    }
    throw error;
  }
}

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

  return {
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
          offsetY: -15,
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
  };
};

const getMinCoverage = (data) => Math.min(...data.map((item) => item.coverage));
const getMaxCoverage = (data) => Math.max(...data.map((item) => item.coverage));

const buildIntervalsChart = (intervals) => ({
  series: [
    {
      name: "Cobertura",
      data: intervals.map((interval) => `${interval?.coverage.toFixed(2)}%`),
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: intervals.map((interval) => interval.interval),
      title: {
        text: "Intervalo",
        offsetY: -15,
      },
      labels: {
        rotateAlways: true,
      },
    },
    yaxis: {
      title: {
        text: "% Cobertura",
      },
      min: getMinCoverage(intervals) - 5,
      max: getMaxCoverage(intervals) + 5,
      tickAmount: 4,
    },
    fill: {
      opacity: 1,
    },
  },
});

const RepositoryView = ({ repository }) => {
  const commonStyles = useCommonStyles();
  const hasPullRequests = !!repository.pull_requests?.length;
  const pullRequestsChart = React.useMemo(
    () => (hasPullRequests ? buildPullRequestsChart(repository.pull_requests) : null),
    [hasPullRequests, repository.pull_requests]
  );
  const hasIntervals = !!repository.intervals?.length;
  const intervalsChart = React.useMemo(
    () => (hasIntervals ? buildIntervalsChart(repository.intervals) : null),
    [hasIntervals, repository.intervals]
  );

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

  return (
    <Box mx={2}>
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
                    <Typography component="span" sx={commonStyles.bold}>
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
                  <Typography component="span" mb={2} sx={commonStyles.bold}>
                    Status:{" "}
                  </Typography>
                  <Typography component="span">
                    {RepositoryStatusTranslator[repository.repository.status]}
                  </Typography>
                </Grid>
                {repository.repository.status_info && (
                  <Grid item mb={2}>
                    <Typography component="span" mb={2} sx={commonStyles.bold}>
                      Mensagem:{" "}
                    </Typography>
                    <Typography component="span">
                      {repository.repository.status_info}
                    </Typography>
                  </Grid>
                )}
                <Grid item>
                  <Typography component="span" mb={2} sx={commonStyles.bold}>
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
                    <Typography component="span" mb={2} sx={commonStyles.bold}>
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
                    <Typography component="span" mb={2} sx={commonStyles.bold}>
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
        {intervalsChart && (
          <Grid item xs={12}>
            <Paper>
              <Box mx={2} py={1}>
                <ChartTitle
                  title="Evolução da cobertura"
                  description="Evolução da cobertura de testes deste repositório ao longo do tempo, calculada a partir dos commits nas branches master/main. Os commits são agrupados em intervalos de 4 meses (até 3 por ano) e cada ponto é a média de cobertura (%) dos commits daquele intervalo, ordenados cronologicamente."
                />
                <div id="chart">
                  <ReactApexChart
                    options={intervalsChart.options}
                    series={intervalsChart.series}
                    type="line"
                    height={350}
                  />
                </div>
              </Box>
            </Paper>
          </Grid>
        )}
        {pullRequestsChart && (
          <Grid item xs={12}>
            <Paper>
              <Box mx={2} py={1}>
                <ChartTitle
                  title="Pull Requests"
                  description="Cobertura de testes dos últimos pull requests mesclados deste repositório, comparando a branch BASE (antes do merge) com a HEAD (depois do merge). Cada par de barras é um pull request, identificado pelo número na Codecov."
                />
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
    </Box>
  );
};

export default RepositoryView;
