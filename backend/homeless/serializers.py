from rest_framework import serializers
from .models import SensorRecord, Light, Fan, ActivityLog, Schedule

class SensorRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorRecord
        fields = ['id', 'sensor', 'value', 'timestamp']

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'start_time', 'end_time', 'everyday']

class LightSerializer(serializers.ModelSerializer):
    schedules = ScheduleSerializer(many=True)
    class Meta:
        model = Light
        fields = ['status', 'schedules']

class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = ['is_manual', 'status', 'threshold']
        
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'type', 'timestamp', 'status']