# Generated by Django 5.0.4 on 2024-04-21 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homeless', '0004_activitylog'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='activitylog',
            name='action',
        ),
        migrations.AddField(
            model_name='activitylog',
            name='status',
            field=models.BooleanField(default=False),
        ),
    ]