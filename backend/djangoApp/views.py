from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import models
import json
from .serializers import FilesSerializer, JsonCsvSerializer

@api_view(['GET'])
def get_files(request):
    
    files = models.Files.objects.all()[:50]
    serializer_class = FilesSerializer(files, many=True)

    context = {
        'files': serializer_class.data
    }
    return Response(context)

@api_view(['POST'])
def upload_jsonCSV(request):
    decoded_req = json.loads(request.body)
    data = decoded_req['res']
    file_name = decoded_req['file_name']

    if models.Files.objects.filter(file_name=file_name).exists():
        return Response()

    fileListEntry = models.Files(
        file_name = file_name
    )
    fileListEntry.save()
    
    file = models.JsonCSV(
        file = data,
        file_name = file_name
    )

    file.save()

    return Response()

@api_view(['GET'])
def get_jsonCSV(request):
    fileName = request.GET.get('name', '')
    file = models.JsonCSV.objects.filter(file_name=fileName)
    #file = models.JsonCSV.objects.all()
    serializer_class = JsonCsvSerializer(file, many=True)

    return Response(serializer_class.data[0])