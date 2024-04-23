import requests
from datetime import datetime
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SensorRecord, Light, Fan, ActivityLog, Schedule
from .serializers import SensorRecordSerializer, LightSerializer, FanSerializer, ActivityLogSerializer, ScheduleSerializer

class LatestTemperature(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        latest_record = SensorRecord.objects.filter(sensor='cam-bien-nhiet-do').latest('timestamp')
        serializer = SensorRecordSerializer(latest_record)
        return Response(serializer.data['value'])

class LatestHumidity(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        latest_record = SensorRecord.objects.filter(sensor='cam-bien-do-am').latest('timestamp')
        serializer = SensorRecordSerializer(latest_record)
        return Response(serializer.data['value'])

class LatestHumanDetect(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        latest_record = SensorRecord.objects.filter(sensor='canh-bao').latest('timestamp')
        serializer = SensorRecordSerializer(latest_record)
        return Response(serializer.data['value'])


class SensorRecordView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Define the URLs for fetching sensor data
        urls = [
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-nhiet-do/data?start_time=today",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-do-am/data?start_time=today",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/canh-bao/data?start_time=today",
        ]

        for url in urls:
            response = requests.get(url)
            if response.status_code == 200:
                sensor_data = response.json()
                
                # Create a Record for each data point
                for data in sensor_data:
                    if not SensorRecord.objects.filter(id=data['id']).exists():
                        if data['feed_key'] == "canh-bao":
                            value = 1 if data['value'] == "CO NGUOI" else 0
                        else:
                            value = data['value']
                        timestamp = data['created_at']
                        timestamp = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
                        SensorRecord.objects.create(id=data['id'],sensor=data['feed_key'], value=value, timestamp=timestamp)
            else:
                return JsonResponse({'error': f'Failed to fetch sensor data from {url}'}, status=500)

        return JsonResponse({'message': 'Sensor data updated successfully'}, status=200)
    

class LightView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        latest_light_log = ActivityLog.objects.filter(type='light').latest('timestamp')
        light = Light.objects.first() 
        serializer = FanSerializer(latest_light_log)
        light.status = latest_light_log.status
        light.save()
        serializer = LightSerializer(light)

        return Response(serializer.data)

    def post(self, request, format=None):
        light = Light.objects.first() 
        light.status = request.data.get('status', light.status)
        light.save()
        serializer = LightSerializer(light)
        return Response(serializer.data)

class FanView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        # Get the latest activity log for the fan
        latest_fan_log = ActivityLog.objects.filter(type='fan').latest('timestamp')
        fan = Fan.objects.first()
        serializer = FanSerializer(latest_fan_log)
        fan.status = latest_fan_log.status
        fan.save()
        serializer = FanSerializer(fan)
        return Response(serializer.data)
    
    def patch(self, request, format=None):
        fan = Fan.objects.first()
        is_manual = request.data.get('is_manual', fan.is_manual)
        if is_manual is not None:
            fan.is_manual = is_manual
        threshold = request.data.get('threshold')
        if threshold is not None:
            fan.threshold = threshold
        fan.save()
        serializer = FanSerializer(fan)
        return Response(serializer.data)
    
class ActivityLogView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Define the URLs for fetching switch data
        urls = [
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-den/data",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-quat/data",
        ]

        for url in urls:
            response = requests.get(url)
            if response.status_code == 200:
                switch_data = response.json()

                # Create a log entry for each data point
                for data in switch_data:
                    # Check if an entry with the same id exists
                    if not ActivityLog.objects.filter(id=data['id']).exists():
                        # Determine the type based on the feed_key
                        if "cong-tac-den" in data['feed_key']:
                            log_type = "light"
                        elif "cong-tac-quat" in data['feed_key']:
                            log_type = "fan"
                        else:
                            continue  # Skip if it's neither light nor fan

                        # Determine the status based on the value
                        status = data['value'] == "1"

                        # Extract timestamp
                        timestamp = datetime.strptime(data['created_at'], "%Y-%m-%dT%H:%M:%SZ")

                        # Create ActivityLog entry
                        ActivityLog.objects.create(id=data['id'], type=log_type, timestamp=timestamp, status=status)
            else:
                return JsonResponse({'error': f'Failed to fetch switch data from {url}'}, status=500)

        return JsonResponse({'message': 'Switch data updated successfully'}, status=200)
    
    def post(self, request):
        id = request.data.get('id')
        status = request.data.get('status')
        timestamp = datetime.now()
        type = request.data.get('type')
        # Create the ActivityLog entry
        ActivityLog.objects.create(id=id, type=type, timestamp=timestamp, status=status)

        return Response({'message': 'Activity log created successfully'})
    
class ScheduleView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, format=None):
        schedules = Schedule.objects.all()
        serializer = ScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)