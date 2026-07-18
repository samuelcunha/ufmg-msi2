import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import dynamic from "next/dynamic";
import React from "react";
import { useRouter } from "next/router";
import { getServerClient } from "../src/api/coverit";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartLoader = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

const ChartTitle = ({ title, description }) => (
  <Grid container sx={{ alignItems: "center" }} style={{ width: "fit-content" }} size={12}>
    <h2 style={{ marginRight: 4 }}>{title}</h2>
    <Tooltip title={description}>
      <IconButton size="small">
        <InfoOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Grid>
);

export async function getServerSideProps() {
  const client = getServerClient();
  const [languagesRes, ownersRes, intervalsRes] = await Promise.all([
    client.get("/coverage/language"),
    client.get("/coverage/owner"),
    client.get("/coverage/interval"),
  ]);

  return {
    props: {
      initialLanguages: languagesRes.data?.languages || [],
      initialOwners: ownersRes.data?.owners || [],
      initialIntervals: intervalsRes.data?.intervals || [],
    },
  };
}

const getMinCoverage = (data) => Math.min(...data.map((item) => item.coverage));
const getMaxCoverage = (data) => Math.max(...data.map((item) => item.coverage));

const buildLanguagesChart = (languages, onRendered, onSelect) => ({
  series: [
    {
      data: languages.map((lang) => `${lang?.coverage.toFixed(2)}%`),
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "bar",
      events: {
        mounted: () => onRendered(),
        dataPointSelection: (event, chartContext, config) => {
          onSelect(languages[config.dataPointIndex]?.language);
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: languages.map((pull) => pull.language),
      title: {
        text: "Linguagem",
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
      min: getMinCoverage(languages) - 2,
      max: getMaxCoverage(languages) + 2,
      tickAmount: 4,
    },
    fill: {
      opacity: 1,
    },
  },
});

const buildOwnersChart = (owners, onRendered, onSelect) => ({
  series: [
    {
      data: owners.map((owner) => `${owner?.coverage.toFixed(2)}%`),
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "bar",
      events: {
        mounted: () => onRendered(),
        dataPointSelection: (event, chartContext, config) => {
          onSelect(owners[config.dataPointIndex]?.owner);
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "70%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: owners.map((pull) => pull.owner),
      title: {
        text: "Proprietário",
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
      min: getMinCoverage(owners) - 2,
      max: getMaxCoverage(owners) + 2,
      tickAmount: 4,
    },
    fill: {
      opacity: 1,
    },
  },
});

const buildIntervalsChart = (intervals, onRendered) => ({
  series: [
    {
      name: "Intervalos",
      data: intervals.map((interval) => `${interval?.coverage.toFixed(2)}%`),
    },
  ],
  options: {
    chart: {
      height: 350,
      type: "line",
      events: {
        mounted: () => onRendered(),
      },
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
      categories: intervals.map((pull) => pull.interval),
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

const Home = ({ initialLanguages, initialOwners, initialIntervals }) => {
  const router = useRouter();
  const [languagesRendered, setLanguagesRendered] = React.useState(false);
  const [ownersRendered, setOwnersRendered] = React.useState(false);
  const [intervalsRendered, setIntervalsRendered] = React.useState(false);

  const goToLanguage = React.useCallback(
    (language) =>
      language && router.push(`/repositories?language=${encodeURIComponent(language)}`),
    [router]
  );
  const goToOwner = React.useCallback(
    (owner) => owner && router.push(`/repositories?owner=${encodeURIComponent(owner)}`),
    [router]
  );

  const languagesChart = React.useMemo(
    () => buildLanguagesChart(initialLanguages, () => setLanguagesRendered(true), goToLanguage),
    [initialLanguages, goToLanguage]
  );
  const ownersChart = React.useMemo(
    () => buildOwnersChart(initialOwners, () => setOwnersRendered(true), goToOwner),
    [initialOwners, goToOwner]
  );
  const intervalsChart = React.useMemo(
    () => buildIntervalsChart(initialIntervals, () => setIntervalsRendered(true)),
    [initialIntervals]
  );

  return (
    <Box sx={{
      mx: 2
    }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={12}>
          <Paper>
            <Box
              sx={{
                mx: 2,
                py: 1
              }}>
              {languagesRendered && (
                <>
                  <ChartTitle
                    title="Cobertura por linguagem"
                    description="Média de cobertura de testes por linguagem principal dos repositórios processados com sucesso. Cada barra é a média simples da cobertura (%) entre os repositórios daquela linguagem; só entram linguagens com mais de 1 repositório cadastrado, para evitar amostras de tamanho 1."
                  />
                  <Typography variant="caption" sx={{
                    color: "text.secondary"
                  }}>
                    Clique em uma barra para ver os repositórios dessa linguagem.
                  </Typography>
                </>
              )}
              <Box
                sx={{
                  position: "relative",
                  minHeight: 350,
                  "& .apexcharts-bar-area": { cursor: "pointer" },
                }}
              >
                {!languagesRendered && <ChartLoader />}
                <div id="chart">
                  <ReactApexChart
                    options={languagesChart.options}
                    series={languagesChart.series}
                    type="bar"
                    height={350}
                  />
                </div>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={12}>
          <Paper>
            <Box
              sx={{
                mx: 2,
                py: 1
              }}>
              {ownersRendered && (
                <>
                  <ChartTitle
                    title="Cobertura por proprietário"
                    description="Média de cobertura de testes agrupada pelo dono/organização do repositório no GitHub. Cada barra é a média simples da cobertura (%) de todos os repositórios cadastrados daquele proprietário, incluindo proprietários com um único repositório."
                  />
                  <Typography variant="caption" sx={{
                    color: "text.secondary"
                  }}>
                    Clique em uma barra para ver os repositórios desse proprietário.
                  </Typography>
                </>
              )}
              <Box
                sx={{
                  position: "relative",
                  minHeight: 350,
                  "& .apexcharts-bar-area": { cursor: "pointer" },
                }}
              >
                {!ownersRendered && <ChartLoader />}
                <div id="chart">
                  <ReactApexChart
                    options={ownersChart.options}
                    series={ownersChart.series}
                    type="bar"
                    height={350}
                  />
                </div>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Paper>
            <Box
              sx={{
                mx: 2,
                py: 1
              }}>
              {intervalsRendered && (
                <ChartTitle
                  title="Cobertura por intervalo"
                  description="Evolução da cobertura de testes ao longo do tempo, calculada a partir dos commits nas branches master/main de todos os repositórios. Os commits são agrupados em intervalos de 4 meses (até 3 por ano) e cada ponto é a média de cobertura (%) dos commits daquele intervalo, ordenados cronologicamente."
                />
              )}
              <Box sx={{ position: "relative", minHeight: 350 }}>
                {!intervalsRendered && <ChartLoader />}
                <div id="chart">
                  <ReactApexChart
                    options={intervalsChart.options}
                    series={intervalsChart.series}
                    type="line"
                    height={350}
                  />
                </div>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
