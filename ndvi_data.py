import pandas as pd
import matplotlib.pyplot as plt


#calculando a media dos ndvi por mes
#def calcula_media_ndvi_mes(){
    #   for row in df.ite(){

    #} 
    ## para cada iteração de 1 - 10 linha do noso data frame{
    #   pegamos os registros de mesmo mes, ou seja, que tem 2020-Oi
    #   pegamos os seus ndvis e fazemos a media (ndvi1+ndvi2)/2QWQ                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
df = pd.read_csv("ndvi_cerrado_2020-2025.csv")
df_2020 = df[df['data'].str.startswith('2020')]
print(df_2020)

plt.plot(df_2020['data'],df_2020['ndvi'])
plt.show()


plt.