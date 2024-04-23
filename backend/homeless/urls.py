
from django.urls import path
from . import views

urlpatterns = [
    path("record/", views.SensorRecordView.as_view(), name="sensor_record"),
    path('temperature-record/latest/', views.LatestTemperature.as_view(), name='temperature-record'),
    path('humidity-record/latest/', views.LatestHumidity.as_view(), name='humidity-record'),
    path('human-detect-record/latest/', views.LatestHumanDetect.as_view(), name='human-detect-record'),
    path('light/', views.LightView.as_view()),
    path('fan/', views.FanView.as_view()),
    path('activity-log/', views.ActivityLogView.as_view()),
    path('schedule/', views.ScheduleView.as_view()),
]
