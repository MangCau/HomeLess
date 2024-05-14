from django.db import models

class SensorRecord(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    sensor = models.CharField(max_length=50, null=True, blank=True)
    value = models.FloatField()
    timestamp = models.DateTimeField()

    
class Fan(models.Model):
    is_manual = models.BooleanField(default=False)
    status = models.BooleanField(default=False)
    threshold = models.IntegerField(null=True, blank=True) 
    
    
class Schedule(models.Model):
    id = models.AutoField(primary_key=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    # everyday = models.BooleanField(default=False)

    def __str__(self):
        return f'Schedule {self.id}'


class Light(models.Model):
    status = models.BooleanField(default=False)
    schedules = models.ManyToManyField(Schedule, related_name='lights')


class FanLog(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)

class FanAutoLog(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_manual = models.BooleanField(default=False)

class FanThresholdLog(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    timestamp = models.DateTimeField(auto_now_add=True)
    threshold = models.IntegerField(null=True, blank=True)

class LightLog(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)
