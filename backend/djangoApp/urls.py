from django.urls import path

from . import views

urlpatterns = [
    path("files/", views.get_files),
    path("upload_jsonCSV/", views.upload_jsonCSV),
    path("jsonCSV/", views.get_jsonCSV)
]