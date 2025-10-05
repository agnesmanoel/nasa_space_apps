import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
from neuralprophet import NeuralProphet # Note: NeuralProphet uses y/ds columns by default
from neuralprophet import NeuralProphet
import matplotlib.pyplot as plt
import logging


with open("precipitacao.json", "r") as f:
    data = json.load(f)

chuva_dict = data["properties"]["parameter"]["PRECTOTCORR"]

df = pd.DataFrame(list(chuva_dict.items()), columns=["ds", "y"])
df["ds"] = pd.to_datetime(df["ds"], format="%Y%m%d") # Convert to datetime objects

df_mes = df.set_index("ds").resample("ME").sum().reset_index()

df_mes = df_mes.dropna().reset_index(drop=True)

print("DataFrame Mensal (Agregado):")
print(df_mes.head())


m = NeuralProphet(
    growth='linear', 
    yearly_seasonality=True,
    weekly_seasonality=False, # Since we are using monthly data
    daily_seasonality=False, # Since we are using monthly data
    seasonality_mode='multiplicative', 
    # seasonality_mode='additive', 
    quantiles=[0.05, 0.95]
    )

df_train, df_val = m.split_df(df_mes, freq='ME', valid_p=0.2)
m.fit(df_train, freq='ME', validation_df=df_val, epochs=1500, progress=None) 


future = m.make_future_dataframe(df_train, periods=24, n_historic_predictions=len(df_mes)) 
# future = m.make_future_dataframe(df_mes, periods=24, n_historic_predictions=len(df_mes)) 
forecast = m.predict(future)

# Gráfico dos componentes (sazonalidade, tendência, etc.)
fig_components = m.plot_components(forecast)
fig_components.show()

# Gráfico principal de previsão
fig_forecast = m.plot(forecast)
fig_forecast.show()

print("\nPrevisão dos Próximos 24 Meses:")
cols = [c for c in ['ds', 'yhat1', 'yhat1_lower', 'yhat1_upper'] if c in forecast.columns]
print(forecast[cols])

forecast[cols].to_csv("previsao_precipitacao_mensal_neural_menor.csv", index=False)
