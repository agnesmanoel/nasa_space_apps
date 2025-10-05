import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import json
from neuralprophet import NeuralProphet # Note: NeuralProphet uses y/ds columns by default



with open("temperatura.json", "r") as f:
    data = json.load(f)

temp_dict = data["properties"]["parameter"]["T2M"]

df = pd.DataFrame(list(temp_dict.items()), columns=["ds", "y"])
df["ds"] = pd.to_datetime(df["ds"], format="%Y%m%d") # Convert to datetime objects

df_mes = df.set_index("ds").resample("M").mean().reset_index()

df_mes = df_mes.dropna().reset_index(drop=True)

print("DataFrame Mensal (Agregado):")
print(df_mes.head())



m = NeuralProphet(
    growth='off', 
    yearly_seasonality=True,
    weekly_seasonality=False, # Since we are using monthly data
    daily_seasonality=False, # Since we are using monthly data
    quantiles=[0.05, 0.95] 
)

df_train, df_val = m.split_df(df_mes, freq='M', valid_p=0.2)

metrics = m.fit(df_train, freq='M', validation_df=df_val, epochs=1000,
                progress=None) 


future = m.make_future_dataframe(df_train, periods=24) 
forecast = m.predict(future)

# Gráfico dos componentes (sazonalidade, tendência, etc.)
fig_components = m.plot_components(forecast)
fig_components.show()

# Gráfico principal de previsão
fig_forecast = m.plot(forecast)
fig_forecast.show()

print("\nPrevisão dos Próximos 24 Meses:")
cols = [c for c in ['ds', 'yhat1', 'yhat1_lower', 'yhat1_upper'] if c in forecast.columns]
print(forecast[cols].tail(24))