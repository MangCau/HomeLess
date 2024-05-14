
from django.urls import path
from . import views

urlpatterns = [
    path("record/", views.SensorRecordView.as_view()),
    path("record/<int:day>/", views.GetSensorRecord.as_view()),
    path('temperature-record/latest/', views.LatestTemperature.as_view()),
    path('humidity-record/latest/', views.LatestHumidity.as_view()),
    path('human-detect-record/latest/', views.LatestHumanDetect.as_view()),
    path('light/', views.LightView.as_view()),
    path('light/<int:day>/', views.LightWorkingTime.as_view()),
    path('fan/', views.FanView.as_view()),
    path('fan/<int:day>/', views.FanWorkingTime.as_view()),
    path('fan-log/', views.FanLogView.as_view()),
    path('fan-log/<int:day>/', views.GetFanLog.as_view()),
    path('light-log/', views.LightLogView.as_view()),
    path('light-log/<int:day>/', views.GetLightLog.as_view()),
    path('schedule/', views.ScheduleView.as_view()),
    path('add-schedule/', views.AddSchedule.as_view()),
]
