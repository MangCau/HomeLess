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
    id = models.AutoField(primary_key=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    everyday = models.BooleanField(default=False)

    def __str__(self):
        if self.everyday:
            return f"Everyday: {self.start_time} - {self.end_time}"
        else:
            return f"{self.start_time} - {self.end_time}"

class Light(models.Model):
    status = models.BooleanField(default=False)
    schedules = models.ManyToManyField(Schedule, related_name='lights')
    

    def __str__(self):
        return f"Light"

class ActivityLog(models.Model):
    id = models.CharField(primary_key=True, max_length=50, default="1")
    TYPE_CHOICES = (
        ('fan', 'Fan'),
        ('light', 'Light'),
    )

    type = models.CharField(max_length=5, choices=TYPE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.type}: {'on' if self.status else 'off'} {self.timestamp}"
    
