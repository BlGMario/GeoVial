from django.db import models

class GeoVialEjes(models.Model):
    gid = models.AutoField(primary_key=True) 
    COD_RUTA = models.CharField(max_length=50)
    cod_ds12 = models.CharField(max_length=50)
    tray_ds12 = models.CharField(max_length=254)
    tray_ds11 = models.CharField(max_length=254)
    ubigeo = models.CharField(max_length=50)
    dep = models.CharField(max_length=50)
    prov = models.CharField(max_length=100)
    cod_dep = models.CharField(max_length=50)
    cod_prov = models.CharField(max_length=50)
    long_km = models.FloatField()
    obs = models.CharField(max_length=100)
    sentido = models.CharField(max_length=50)
    base = models.CharField(max_length=50)
    data = models.CharField(max_length=50)
    fecha_actu = models.CharField(max_length=50)
    # geom no se incluye

    class Meta:
        managed = False  # Django no gestionará la tabla (no crea ni modifica)
        db_table = '"GeoDataJVR"."DS011_2016_RVD_EJES"'