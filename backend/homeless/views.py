import requests
import pytz
from datetime import datetime, timedelta
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SensorRecord, Light, Fan, FanLog, LightLog, Schedule, FanAutoLog, FanThresholdLog
from .serializers import SensorRecordSerializer, LightSerializer, FanSerializer, FanLogSerializer, LightLogSerializer, ScheduleSerializer, FanAutoLogSerializer, FanThresholdLogSerializer
from collections import defaultdict
from django.utils import timezone
from django.db.models import Sum

io_key = "aio_bFtQ450kcjBUtmlZNJev3QoVqrC0" 

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
        urls = [
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-nhiet-do/data?start_time=today",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-do-am/data?start_time=today",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/canh-bao/data?start_time=today",
            "https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-khoang-cach/data?start_time=yesterday",
        ]

        for url in urls:
            response = requests.get(url)
            if response.status_code == 200:
                sensor_data = response.json()
                
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

    def patch(self, request, format=None):
        light = Light.objects.first()
        new_status = request.data.get('status')
        light.status = new_status
        light.save()
        serializer = LightSerializer(instance=light)
        feed_url = "https://io.adafruit.com/api/v2/homeless_da01/feeds/cong-tac-den/data"

        headers = {
            "Content-Type": "application/json",
            "X-AIO-Key": io_key
        }
        data = {
            "value": "1" if new_status else "0"
        }

        response = requests.post(feed_url, headers=headers, json=data)

        if response.status_code == 200:
            print("Data posted successfully to Adafruit IO feed:", response.json())
        else:
            print("Failed to post data to Adafruit IO feed:", response.status_code, response.text)

        return Response(serializer.data, status=status.HTTP_200_OK)

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
        status = request.data.get('status')
        is_manual = request.data.get('is_manual')
        threshold = request.data.get('threshold')
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

        records = LightLog.objects.all()
        serializer = LightLogSerializer(records, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        serializer = LightLogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


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

        records = FanLog.objects.all()
        serializer = FanLogSerializer(records, many=True)
        return Response(serializer.data)

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
        try:
            schedule_id = request.data.get('id')
            if schedule_id is None:
                return Response({'error': 'Schedule ID not provided'}, status=400)
            
            schedule = Schedule.objects.get(pk=schedule_id)
            schedule.delete()
            return Response({'message': f'Schedule with ID {schedule_id} deleted successfully'}, status=200)
        except Schedule.DoesNotExist:
            return Response({'error': f'Schedule with ID {schedule_id} does not exist'}, status=404)
        
class GetSensorRecord(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        start_date = datetime.utcnow() - timedelta(days=day)
        start_date_str = start_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        records = SensorRecord.objects.filter(timestamp__gte=start_date).order_by('-timestamp')
        serializer = SensorRecordSerializer(records, many=True)

        return Response(serializer.data)

class FanWorkingTime(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        utc = pytz.UTC
        start_date = datetime.utcnow() - timedelta(days=day)
        start_date = utc.localize(start_date)

        fan_logs = FanLog.objects.filter(timestamp__gte=start_date).order_by('timestamp')
        fan_auto_logs = FanAutoLog.objects.filter(timestamp__gte=start_date).order_by('timestamp')
        
        merged_logs = sorted(
            list(fan_logs) + list(fan_auto_logs),
            key=lambda log: log.timestamp
        )
        
        working_times = defaultdict(float)
        current_status = None
        current_start_time = None

        for log in merged_logs:
            if log.timestamp.tzinfo is None:
                log.timestamp = utc.localize(log.timestamp)

            if isinstance(log, FanLog):
                if current_status is None or current_status != log.status:
                    if current_status:
                        working_times[current_start_time.date()] += (log.timestamp - current_start_time).total_seconds()
                    current_status = log.status
                    if log.status:
                        current_start_time = log.timestamp
            elif isinstance(log, FanAutoLog):
                if current_status is None or current_status != log.is_manual:
                    if current_status:
                        working_times[current_start_time.date()] += (log.timestamp - current_start_time).total_seconds()
                    current_status = log.is_manual
                    if log.is_manual:
                        current_start_time = log.timestamp

        if current_status:
            now_utc = timezone.now()
            working_times[current_start_time.date()] += (now_utc - current_start_time).total_seconds()

        working_time_list = [
            {'date': date.strftime('%Y-%m-%d'), 'working_time_seconds': working_time}
            for date, working_time in sorted(working_times.items())
        ]

        return Response(working_time_list)
    
class LightWorkingTime(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        utc = pytz.UTC
        start_date = datetime.utcnow() - timedelta(days=day)
        start_date = utc.localize(start_date)

        light_logs = LightLog.objects.filter(timestamp__gte=start_date).order_by('timestamp')
        
        working_times = defaultdict(float)
        current_status = None
        current_start_time = None

        for log in light_logs:
            if log.timestamp.tzinfo is None:
                log.timestamp = utc.localize(log.timestamp)

            if current_status is None or current_status != log.status:
                if current_status:
                    working_times[current_start_time.date()] += (log.timestamp - current_start_time).total_seconds()
                current_status = log.status
                if log.status:
                    current_start_time = log.timestamp

        if current_status:
            now_utc = timezone.now()
            working_times[current_start_time.date()] += (now_utc - current_start_time).total_seconds()

        working_time_list = [
            {'date': date.strftime('%Y-%m-%d'), 'working_time_seconds': working_time}
            for date, working_time in sorted(working_times.items())
        ]

        return Response(working_time_list)
    
class GetFanLog(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        utc = pytz.UTC
        start_date = datetime.utcnow() - timedelta(days=day)
        start_date = utc.localize(start_date)

        fan_logs = FanLog.objects.filter(timestamp__gte=start_date)
        fan_auto_logs = FanAutoLog.objects.filter(timestamp__gte=start_date)

        combined_logs = sorted(
            list(fan_logs) + list(fan_auto_logs),
            key=lambda log: log.timestamp,
            reverse=True
        )

        serialized_logs = []
        for log in combined_logs:
            if isinstance(log, FanLog):
                serialized_logs.append(FanLogSerializer(log).data)
            elif isinstance(log, FanAutoLog):
                serialized_logs.append(FanAutoLogSerializer(log).data)

        return Response(serialized_logs)
    
class GetLightLog(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        start_date = datetime.utcnow() - timedelta(days=day)
        start_date_str = start_date.strftime('%Y-%m-%dT%H:%M:%SZ')
        logs = LightLog.objects.filter(timestamp__gte=start_date).order_by('-timestamp')
        serializer = LightLogSerializer(logs, many=True)

        return Response(serializer.data)
    
class AddSchedule(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class Chart1(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        utc = pytz.UTC
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=day)
        start_date = utc.localize(start_date)
        end_date = utc.localize(end_date)

        sensor_records = SensorRecord.objects.filter(
            timestamp__gte=start_date,
            timestamp__lte=end_date,
            sensor='canh-bao'
        )

        detection_sums = sensor_records.extra({
            'date': "DATE(timestamp)"
        }).values('date').annotate(sum=Sum('value')).order_by('date')
        detection_dict = {detection['date']: detection['sum'] for detection in detection_sums}

        current_date = start_date.date()
        results = []
        while current_date <= end_date.date():
            current_date_str = current_date.strftime('%Y-%m-%d')
            if current_date_str in detection_dict:
                detection_count = detection_dict[current_date_str]
            else:
                detection_count = 0
            results.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'detection_count': detection_count,
            })
            current_date += timedelta(days=1)

        return Response(results)
    
class Chart2(APIView):
    permission_classes = [AllowAny]

    def get(self, request, day):
        utc = pytz.UTC
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=day)
        start_date = utc.localize(start_date)
        end_date = utc.localize(end_date)

        sensor_records = SensorRecord.objects.filter(
            timestamp__gte=start_date,
            timestamp__lte=end_date,
            sensor__in=['cam-bien-nhiet-do', 'cam-bien-do-am']
        )

        last_temp_record = SensorRecord.objects.filter(
            timestamp__lt=start_date,
            sensor='cam-bien-nhiet-do'
        ).order_by('-timestamp').first()

        last_humidity_record = SensorRecord.objects.filter(
            timestamp__lt=start_date,
            sensor='cam-bien-do-am'
        ).order_by('-timestamp').first()

        temp_sums = defaultdict(float)
        temp_counts = defaultdict(int)
        humidity_sums = defaultdict(float)
        humidity_counts = defaultdict(int)

        for record in sensor_records:
            date = record.timestamp.date()
            if record.sensor == 'cam-bien-nhiet-do':
                temp_sums[date] += record.value
                temp_counts[date] += 1
            elif record.sensor == 'cam-bien-do-am':
                humidity_sums[date] += record.value
                humidity_counts[date] += 1

        current_date = start_date.date()
        results = []
        last_mean_temp = last_temp_record.value if last_temp_record else None
        last_mean_humidity = last_humidity_record.value if last_humidity_record else None

        while current_date <= end_date.date():
            if temp_counts[current_date] > 0:
                mean_temp = temp_sums[current_date] / temp_counts[current_date]
                last_mean_temp = mean_temp
            else:
                mean_temp = last_mean_temp

            if humidity_counts[current_date] > 0:
                mean_humidity = humidity_sums[current_date] / humidity_counts[current_date]
                last_mean_humidity = mean_humidity
            else:
                mean_humidity = last_mean_humidity

            results.append({
                'date': current_date.strftime('%Y-%m-%d'),
                'mean_temp': mean_temp,
                'mean_humidity': mean_humidity,
            })

            current_date += timedelta(days=1)

        return Response(results)

class DistantRecordView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        records = SensorRecord.objects.all()
        serializer = SensorRecordSerializer(records, many=True)
        return Response(serializer.data)
    