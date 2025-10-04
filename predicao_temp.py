import json
import pandas as pd

with open("temperatura.json", "r") as f:
    data = json.load(f)

temp_dict = data["properties"]["parameter"]["T2M"]

df = pd.DataFrame(list(temp_dict.items()), columns=["data", "temperatura"])

df["data"] = pd.to_datetime(df["data"], format="%Y%m%d")

df = df.sort_values("data").reset_index(drop=True)

print(df.head())

