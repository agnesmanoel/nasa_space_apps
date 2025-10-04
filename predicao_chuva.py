import json
import pandas as pd
from prophet import Prophet
import numpy as np
import matplotlib.pyplot as plt
import os
print(os.getcwd())



with open("precipitacao.json", "r") as f:
    data = json.load(f)

chuva_dict = data["properties"]["parameter"]["PRECTOTCORR"]

df = pd.DataFrame(list(chuva_dict.items()), columns=["ds", "y"])

df["ds"] = pd.to_datetime(df["ds"], format="%Y%m%d")

df = df.sort_values("ds").reset_index(drop=True)

df_mes = df.set_index("ds").resample("ME").sum().reset_index()
df_mes["y_log"] = np.log(df_mes["y"] + 1)

print(df.head())



model = Prophet(yearly_seasonality=True)
model.fit(df_mes)

futuro = model.make_future_dataframe(periods=24, freq="M")
forecast = model.predict(futuro)
forecast["yhat"] = forecast["yhat"].clip(lower=0)
forecast["yhat_lower"] = forecast["yhat_lower"].clip(lower=0)
forecast["yhat_upper"] = forecast["yhat_upper"].clip(lower=0)


forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail()

forecast_futuro = forecast.tail(24)
print(forecast_futuro[['ds', 'yhat', 'yhat_lower', 'yhat_upper']])

fig1 = model.plot(forecast)
plt.ylim(0,200)
plt.show()
fig2 = model.plot_components(forecast)
plt.show()


forecast[["ds", "yhat", "yhat_lower", "yhat_upper"]].to_csv(
    "previsao_chuva_mensal.csv", index=False
)
