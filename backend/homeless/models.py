from django.db import models

class SensorRecord(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    sensor = models.CharField(max_length=50, null=True, blank=True)
    value = models.FloatField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.sensor}:{self.timestamp}"
    
class Fan(models.Model):
    is_manual = models.BooleanField(default=False)
    status = models.BooleanField(default=False)
    threshold = models.IntegerField(null=True, blank=True) 
    

    def __str__(self):
        return f"Fan"
    
class Schedule(models.Model):
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.start_time} - {self.end_time}"

class Light(models.Model):
    is_manual = models.BooleanField(default=False)
    status = models.BooleanField(default=False)
    schedules = models.ManyToManyField(Schedule, related_name='lights')
    

    def __str__(self):
        return f"Light"

class ActivityLog(models.Model):
    TYPE_CHOICES = (
        ('fan', 'Fan'),
        ('light', 'Light'),
    )

    type = models.CharField(max_length=5, choices=TYPE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)
    is_auto = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.type}: {self.timestamp}"