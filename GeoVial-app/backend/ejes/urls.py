from django.urls import path
from .views import GeoVialEjesList, GeoVialEjesDetail

urlpatterns = [
    path('ejes/', GeoVialEjesList.as_view(), name='ejes-list'),
    path('ejes/<str:COD_RUTA>/', GeoVialEjesDetail.as_view(), name='eje-detail'),
]