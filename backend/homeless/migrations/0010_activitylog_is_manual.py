# Generated by Django 5.0.6 on 2024-05-09 12:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homeless', '0009_remove_light_is_manual_schedule_everyday_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='activitylog',
            name='is_manual',
            field=models.BooleanField(default=False),
        ),
    ]
