from rest_framework import serializers
from .models import SensorRecord, Light, Fan, FanLog, LightLog, Schedule, FanAutoLog, FanThresholdLog

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
        
class FanLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanLog
        fields = ['id', 'timestamp', 'status']

class FanAutoLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanAutoLog
        fields = ['id', 'timestamp', 'is_manual']

class FanThresholdLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FanThresholdLog
        fields = ['id', 'timestamp', 'threshold']

class LightLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = LightLog
        fields = ['id', 'timestamp', 'status']