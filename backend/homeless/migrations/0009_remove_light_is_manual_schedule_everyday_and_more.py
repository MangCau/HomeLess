# Generated by Django 5.0.4 on 2024-04-23 11:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('homeless', '0008_alter_activitylog_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='light',
            name='is_manual',
        ),
        migrations.AddField(
            model_name='schedule',
            name='everyday',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='schedule',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]