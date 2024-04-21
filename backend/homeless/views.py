import requests
from datetime import datetime
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SensorRecord, Light, Fan, ActivityLog
from .serializers import SensorRecordSerializer, LightSerializer, FanSerializer, ActivityLogSerializer

class TemperatureRecordAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        latest_record = SensorRecord.objects.filter(sensor='cam-bien-nhiet-do').latest('timestamp')
        serializer = SensorRecordSerializer(latest_record)
        return Response(serializer.data['value'])

class HumidityRecordAPIView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        latest_record = SensorRecord.objects.filter(sensor='cam-bien-do-am').latest('timestamp')
        serializer = SensorRecordSerializer(latest_record)
        return Response(serializer.data['value'])

class HumanDetectRecordAPIView(APIView):
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
                        value = 1 if data['value'] == "CO NGUOI" else 0
                        timestamp = data['created_at']
                        timestamp = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
                        SensorRecord.objects.create(id=data['id'],sensor=data['feed_key'], value=value, timestamp=timestamp)
            else:
                return JsonResponse({'error': f'Failed to fetch sensor data from {url}'}, status=500)

        return JsonResponse({'message': 'Sensor data updated successfully'}, status=200)
    

class LightView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        light = Light.objects.first() 
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
        fan = Fan.objects.first() 
        serializer = FanSerializer(fan)
        return Response(serializer.data)

    def post(self, request, format=None):   
        fan = Fan.objects.first()  
        fan.status = request.data.get('status', fan.status)
        fan.save()
        serializer = FanSerializer(fan)
        return Response(serializer.data)
    
    def patch(self, request, format=None):
        fan = Fan.objects.first()
        fan.is_manual = request.data.get('is_manual', fan.is_manual)
        fan.save()
        serializer = FanSerializer(fan)
        return Response(serializer.data)
    
class ActivityLogListCreateView(generics.ListCreateAPIView):
    queryset = ActivityLog.objects.all()
    serializer_class = ActivityLogSerializer
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        latest_fan_log = ActivityLog.objects.filter(type='fan').latest('timestamp')

        latest_light_log = ActivityLog.objects.filter(type='light').latest('timestamp')

        response_data = {
            'fan_status': latest_fan_log.status,
            'light_status': latest_light_log.status
        }

        return Response(response_data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)