# Generated by Django 3.2.6 on 2024-07-02 02:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('djangoApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='JsonCSV',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.JSONField()),
                ('file_name', models.CharField(max_length=255)),
            ],
        ),
    ]