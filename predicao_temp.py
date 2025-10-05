import json
import pandas as pd
from prophet import Prophet
import numpy as np
import matplotlib.pyplot as plt
import os
import logging
logging.getLogger('prophet').setLevel(logging.WARNING)
print(os.getcwd())

with open("temperatura.json", "r") as f:
    data = json.load(f)

temp_dict = data["properties"]["parameter"]["T2M"]

df = pd.DataFrame(list(temp_dict.items()), columns=["ds", "y"])

df["ds"] = pd.to_datetime(df["ds"], format="%Y%m%d")

df = df.sort_values("ds").reset_index(drop=True)

print("\nDados Diários de Temperatura (T2M):")
print(df.head())

df.set_index("ds")

model = Prophet(yearly_seasonality=True,
                weekly_seasonality=False, 
                daily_seasonality=False) 
model.fit(df)

futuro = model.make_future_dataframe(periods=24, freq="M") 
forecast = model.predict(futuro)


print("\nAnálise da Previsão de Temperatura (24 meses):")
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(24))

fig1 = model.plot(forecast)
plt.title("Previsão Mensal de Temperatura Média (T2M)")
plt.ylabel("Temperatura (°C ou K)")
plt.ylim(0,40) 
plt.show()

fig2 = model.plot_components(forecast)
plt.show()

