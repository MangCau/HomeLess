
from django.urls import path
from . import views

urlpatterns = [
    path("record/", views.SensorRecordView.as_view(), name="sensor_record"),
    path('temperature-record/', views.TemperatureRecordAPIView.as_view(), name='temperature-record'),
    path('humidity-record/', views.HumidityRecordAPIView.as_view(), name='humidity-record'),
    path('human-detect-record/', views.HumanDetectRecordAPIView.as_view(), name='human-detect-record'),
    path('light/', views.LightView.as_view()),
    path('fan/', views.FanView.as_view()),
    path('activity-log/', views.ActivityLogListCreateView.as_view()),
]
