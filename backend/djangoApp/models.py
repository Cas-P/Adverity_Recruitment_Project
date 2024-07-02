from django.db import models

class Files(models.Model):
    file_name = models.CharField(max_length=255)

class JsonCSV(models.Model):
    file = models.JSONField()
    file_name = models.CharField(max_length=255)