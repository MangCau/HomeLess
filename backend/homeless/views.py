import requests
from datetime import datetime
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SensorRecord, Light, Fan, FanLog, LightLog, Schedule, FanAutoLog, FanThresholdLog
from .serializers import SensorRecordSerializer, LightSerializer, FanSerializer, FanLogSerializer, LightLogSerializer, ScheduleSerializer, FanAutoLogSerializer, FanThresholdLogSerializer

io_key = "aio_UOcP45HCpzWj0lRJ0oITqy6aDzwd" 

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
        latest_light_log = LightLogSerializer(LightLog.objects.latest('timestamp')).data
        light = Light.objects.first()
        light.status = latest_light_log['status']
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
        latest_fan_log = FanLog.objects.latest('timestamp')
        latest_fan_auto_log = FanAutoLog.objects.latest('timestamp')
        latest_fan_threshold_log = FanThresholdLog.objects.latest('timestamp')

        fan = Fan.objects.first()
        fan.status = latest_fan_log.status
        fan.is_manual = latest_fan_auto_log.is_manual
        fan.threshold = latest_fan_threshold_log.threshold
        fan.save()

        serializer = FanSerializer(fan)
        return Response(serializer.data)
    
    def patch(self, request, format=None):
        fan = Fan.objects.first() 
        # Extract the fields to update from the request data
        status = request.data.get('status')
        is_manual = request.data.get('is_manual')
        threshold = request.data.get('threshold')
        # Update the corresponding fields based on what's provided in the request
        if status is not None:
            fan.status = status 
            feed_url = "https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-quat/data"
            headers = {
                "Content-Type": "application/json",
                "X-AIO-Key": io_key
            }
            data = {
                "value": "1" if status else "0"
            }

            response = requests.post(feed_url, headers=headers, json=data)
            if response.status_code == 200:
                print("Data posted successfully to Adafruit IO feed:", response.json())
            else:
                print("Failed to post data to Adafruit IO feed:", response.status_code, response.text)
        if is_manual is not None:
            fan.is_manual = is_manual
            feed_url = "https://io.adafruit.com/api/v2/homeless_da01/feeds/mode-fan/data"
            headers = {
                "Content-Type": "application/json",
                "X-AIO-Key": io_key
            }
            data = {
                "value": "1" if is_manual else "0"
            }

            response = requests.post(feed_url, headers=headers, json=data)
            if response.status_code == 200:
                print("Data posted successfully to Adafruit IO feed:", response.json())
            else:
                print("Failed to post data to Adafruit IO feed:", response.status_code, response.text)
        if threshold is not None:
            fan.threshold = threshold
            feed_url = "https://io.adafruit.com/api/v2/homeless_da01/feeds/dat-nhiet-do/data"
            headers = {
                "Content-Type": "application/json",
                "X-AIO-Key": io_key
            }
            data = {
                "value": threshold
            }
            response = requests.post(feed_url, headers=headers, json=data)
            if response.status_code == 200:
                print("Data posted successfully to Adafruit IO feed:", response.json())
            else:
                print("Failed to post data to Adafruit IO feed:", response.status_code, response.text)
                
        fan.save()
        
        return Response('Fan updated successfully')
    
class LightLogView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        url = "https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-den/data"
        response = requests.get(url).json()
        for data in response:
            if not LightLog.objects.filter(id=data['id']).exists():
                timestamp = datetime.strptime(data['created_at'], "%Y-%m-%dT%H:%M:%SZ")
                status = data['value'] == "1"
                LightLog.objects.create(id=data['id'], timestamp=timestamp, status=status)

        return JsonResponse({'message': 'Updated activity log successfully'}, status=200)
    
class FanLogView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        urls = [
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-quat/data",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/mode-fan/data",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/dat-nhiet-do/data"
        ]

        for url in urls:
            response = requests.get(url).json()
            self.update_logs(response, url)

        return Response({'message': 'Updated activity logs successfully'}, status=status.HTTP_200_OK)

    def update_logs(self, response, url):
        if isinstance(response, list):
            for data in response:
                self.update_log(data, url)
        else:
            self.update_log(response, url)

    def update_log(self, data, url):
        timestamp = datetime.strptime(data['created_at'], "%Y-%m-%dT%H:%M:%SZ")

        if "cong-tac-quat" in url:
            log_model = FanLog
            status = data['value'] == "1"
            obj, created = log_model.objects.get_or_create(id=data['id'], defaults={'timestamp': timestamp, 'status': status})
            if not created:
                obj.timestamp = timestamp
                obj.status = status
                obj.save()
        elif "mode-fan" in url:
            log_model = FanAutoLog
            is_manual = data['value'] == "1"
            obj, created = log_model.objects.get_or_create(id=data['id'], defaults={'timestamp': timestamp, 'is_manual': is_manual})
            if not created:
                obj.timestamp = timestamp
                obj.is_manual = is_manual
                obj.save()
        elif "dat-nhiet-do" in url:
            log_model = FanThresholdLog
            threshold = int(data['value'])
            obj, created = log_model.objects.get_or_create(id=data['id'], defaults={'timestamp': timestamp, 'threshold': threshold})
            if not created:
                obj.timestamp = timestamp
                obj.threshold = threshold
                obj.save()
    
    def post(self, request, format=None):
        serializer = None
        log_type = request.data.get('log_type') 

        if log_type == 'status':
            serializer = FanLogSerializer(data=request.data)
        elif log_type == 'auto':
            serializer = FanAutoLogSerializer(data=request.data)
        elif log_type == 'threshold':
            serializer = FanThresholdLogSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)

    
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