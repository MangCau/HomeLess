from rest_framework import serializers
from .models import SensorRecord, Light, Fan, ActivityLog, Schedule

class SensorRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorRecord
        fields = ['id', 'sensor', 'value', 'timestamp']

class LightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Light
        fields = ['is_manual', 'status', 'schedules']

class FanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fan
        fields = ['is_manual', 'status', 'threshold']
        
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['type', 'timestamp', 'status', 'is_auto']