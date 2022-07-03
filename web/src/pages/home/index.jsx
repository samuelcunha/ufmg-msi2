import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import React, { useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import coverit from "../../api/coverit";
import useCommonStyles from "../../hooks/useCommonStyles";
import "./index.css";

const Home = () => {
  const [languages, setLanguages] = React.useState(null);
  const [owners, setOwners] = React.useState(null);
  const [intervals, setIntervals] = React.useState(null);
  const [languagesChart, setLanguagesChart] = React.useState(null);
  const [ownersChart, setOwnersChart] = React.useState(null);
  const [intervalsChart, setIntervalsChart] = React.useState(null);
  const commonStyles = useCommonStyles();

  const getCoverageByLanguage = async () => {
    const response = await coverit.get(`/coverage/language`);
    return response.data?.languages;
  };

  const getCoverageByOwner = async () => {
    const response = await coverit.get(`/coverage/owner`);
    return response.data?.owners;
  };

  const getCoverageByInterval = async () => {
    const response = await coverit.get(`/coverage/interval`);
    return response.data?.intervals;
  };

  useEffect(() => {
    async function fetchData() {
      const byLanguage = await getCoverageByLanguage();
      setLanguages(byLanguage);
      buildLanguagesChart(byLanguage);

      const byOwner = await getCoverageByOwner();
      setOwners(byOwner);
      buildOwnersChart(byOwner);

      const byInterval = await getCoverageByInterval();
      setIntervals(byInterval);
      buildIntervalsChart(byInterval);
    }
    fetchData();
  }, []);

  const getMinCoverage = (data) => {
    return Math.min(...data.map((item) => item.coverage));
  };

  const getMaxCoverage = (data) => {
    return Math.max(...data.map((item) => item.coverage));
  };

  const buildLanguagesChart = (languages) => {
    setLanguagesChart({
      series: [
        {
          data: languages.map((lang) => `${lang?.coverage.toFixed(2)}%`),
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bar",
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
  };

  const buildOwnersChart = (owners) => {
    setOwnersChart({
      series: [
        {
          data: owners.map((owner) => `${owner?.coverage.toFixed(2)}%`),
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "bar",
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
  };

  const buildIntervalsChart = (intervals) => {
    setIntervalsChart({
      series: [
        {
          name: "Intervalos",
          data: intervals.map(
            (interval) => `${interval?.coverage.toFixed(2)}%`
          ),
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
  };

  return (
    <Box mx={2}>
      {languagesChart ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <Box mx={2} py={1}>
                <Grid container item xs={12}>
                  <h2>Cobertura por linguagem</h2>
                </Grid>
                <div id="chart">
                  <ReactApexChart
                    options={languagesChart.options}
                    series={languagesChart.series}
                    type="bar"
                    height={350}
                  />
                </div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: "flex" }} className={commonStyles.fullscreenLoader}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
      {ownersChart ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <Box mx={2} py={1}>
                <Grid container item xs={12}>
                  <h2>Cobertura por proprietário</h2>
                </Grid>
                <div id="chart">
                  <ReactApexChart
                    options={ownersChart.options}
                    series={ownersChart.series}
                    type="bar"
                    height={350}
                  />
                </div>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Box sx={{ display: "flex" }} className={commonStyles.fullscreenLoader}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
      {intervalsChart ? (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <Box mx={2} py={1}>
                <Grid container item xs={12}>
                  <h2>Cobertura por intervalo</h2>
                </Grid>
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
        </Grid>
      ) : (
        <Box sx={{ display: "flex" }} className={commonStyles.fullscreenLoader}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
    </Box>
  );
};

export default Home;
