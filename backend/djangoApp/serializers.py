from rest_framework import serializers

from .models import Files, JsonCSV
        
class FilesSerializer(serializers.ModelSerializer):

    class Meta:
        model = Files
        fields = ('file_name',)

class JsonCsvSerializer(serializers.ModelSerializer):

    class Meta:
        model = JsonCSV
        fields = ('file', 'file_name')