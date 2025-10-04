function aggregateMonthly(data) {
  const monthly = {};

  for (const [date, value] of Object.entries(data)) {
    if (value === -999 || value === null) continue; // ignora fill_value
    const month = date.slice(0, 6);
    if (!monthly[month]) monthly[month] = { sum: 0, count: 0 };
    monthly[month].sum += value;
    monthly[month].count += 1;
  }

  const result = {};
  for (const [month, stats] of Object.entries(monthly)) {
    result[month] = stats.count ? stats.sum / stats.count : 0;
  }
  return result;
}

fetch("dados.json")
  .then(res => res.json())
  .then(data => {
    const params = data.properties.parameter;

    const tempMonthly = aggregateMonthly(params.T2M);
    const rainMonthly = aggregateMonthly(params.PRECTOTCORR);
    const windMonthly = aggregateMonthly(params.WS2M);
    const rhMonthly = aggregateMonthly(params.RH2M);
    const radMonthly = aggregateMonthly(params.ALLSKY_SFC_SW_DWN);

    const months = Object.keys(tempMonthly).sort();
    
    // Temperatura
    new Chart(document.getElementById("tempChart"), {
      type: "line",
      data: {
        labels: months,
        datasets: [{ label: "Temperatura (°C)", data: Object.values(tempMonthly), borderColor: "red", fill: false }]
      }
    });

    // Precipitação
    new Chart(document.getElementById("rainChart"), {
      type: "bar",
      data: {
        labels: months,
        datasets: [{ label: "Precipitação (mm/dia)", data: Object.values(rainMonthly), backgroundColor: "blue" }]
      }
    });

    // Vento
    new Chart(document.getElementById("windChart"), {
      type: "line",
      data: {
        labels: months,
        datasets: [{ label: "Vento (m/s)", data: Object.values(windMonthly), borderColor: "green", fill: false }]
      }
    });

    // Umidade
    new Chart(document.getElementById("rhChart"), {
      type: "line",
      data: {
        labels: months,
        datasets: [{ label: "Umidade (%)", data: Object.values(rhMonthly), borderColor: "orange", fill: false }]
      }
    });

    // Radiação
    new Chart(document.getElementById("radChart"), {
      type: "line",
      data: {
        labels: months,
        datasets: [{ label: "Radiação (MJ/m²/dia)", data: Object.values(radMonthly), borderColor: "purple", fill: false }]
      }
    });
  });
