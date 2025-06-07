from rest_framework import serializers
from .models import GeoVialEjes

class GeoVialEjesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeoVialEjes
        fields = '__all__'  # ✅ Esta línea es obligatoria
