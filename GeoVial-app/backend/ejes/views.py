from django.shortcuts import get_object_or_404
from django.shortcuts import render
from rest_framework import generics
from .models import GeoVialEjes
from .serializers import GeoVialEjesSerializer

class GeoVialEjesList(generics.ListAPIView):
    queryset = GeoVialEjes.objects.all()
    serializer_class = GeoVialEjesSerializer
    
class GeoVialEjesDetail(generics.RetrieveAPIView):
    queryset = GeoVialEjes.objects.all()
    serializer_class = GeoVialEjesSerializer
    lookup_field = 'COD_RUTA'